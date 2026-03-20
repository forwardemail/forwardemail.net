# Domande Frequenti {#frequently-asked-questions}

<img loading="lazy" src="/img/articles/faq.webp" alt="Domande frequenti su Forward Email" class="rounded-lg" />


## Indice {#table-of-contents}

* [Avvio Rapido](#quick-start)
* [Introduzione](#introduction)
  * [Cos'è Forward Email](#what-is-forward-email)
  * [Chi usa Forward Email](#who-uses-forward-email)
  * [Qual è la storia di Forward Email](#what-is-forward-emails-history)
  * [Quanto è veloce questo servizio](#how-fast-is-this-service)
* [Client di Posta Elettronica](#email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [eM Client](#em-client)
  * [Dispositivi Mobili](#mobile-devices)
  * [Configurazione Sendmail SMTP Relay](#sendmail-smtp-relay-configuration)
  * [Configurazione Exim4 SMTP Relay](#exim4-smtp-relay-configuration)
  * [Configurazione msmtp SMTP Client](#msmtp-smtp-client-configuration)
  * [Client Email da Linea di Comando](#command-line-email-clients)
  * [Configurazione Email Windows](#windows-email-configuration)
  * [Configurazione Postfix SMTP Relay](#postfix-smtp-relay-configuration)
  * [Come Inviare Mail Come usando Gmail](#how-to-send-mail-as-using-gmail)
  * [Qual è la guida legacy gratuita per Inviare Mail Come usando Gmail](#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail)
  * [Configurazione Avanzata Routing Gmail](#advanced-gmail-routing-configuration)
  * [Configurazione Avanzata Routing Outlook](#advanced-outlook-routing-configuration)
* [Risoluzione Problemi](#troubleshooting)
  * [Perché non ricevo le mie email di test](#why-am-i-not-receiving-my-test-emails)
  * [Come configuro il mio client email per funzionare con Forward Email](#how-do-i-configure-my-email-client-to-work-with-forward-email)
  * [Perché le mie email finiscono in Spam e Posta Indesiderata e come posso controllare la reputazione del mio dominio](#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)
  * [Cosa devo fare se ricevo email di spam](#what-should-i-do-if-i-receive-spam-emails)
  * [Perché le mie email di test inviate a me stesso in Gmail appaiono come "sospette"](#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious)
  * [Posso rimuovere il via forwardemail dot net in Gmail](#can-i-remove-the-via-forwardemail-dot-net-in-gmail)
* [Gestione Dati](#data-management)
  * [Dove sono localizzati i vostri server](#where-are-your-servers-located)
  * [Come esportare e fare il backup della mia casella di posta](#how-do-i-export-and-backup-my-mailbox)
  * [Come importare e migrare la mia casella di posta esistente](#how-do-i-import-and-migrate-my-existing-mailbox)
  * [Come usare il mio storage compatibile S3 per i backup](#how-do-i-use-my-own-s3-compatible-storage-for-backups)
  * [Come convertire backup SQLite in file EML](#how-do-i-convert-sqlite-backups-to-eml-files)
  * [Supportate il self-hosting](#do-you-support-self-hosting)
* [Configurazione Email](#email-configuration)
  * [Come iniziare e configurare l'inoltro email](#how-do-i-get-started-and-set-up-email-forwarding)
  * [Posso usare più scambi MX e server per inoltri avanzati](#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding)
  * [Come configurare un risponditore automatico per ferie (out of office auto-responder)](#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder)
  * [Come configurare SPF per Forward Email](#how-do-i-set-up-spf-for-forward-email)
  * [Come configurare DKIM per Forward Email](#how-do-i-set-up-dkim-for-forward-email)
  * [Come configurare DMARC per Forward Email](#how-do-i-set-up-dmarc-for-forward-email)
  * [Come visualizzare i report DMARC](#how-do-i-view-dmarc-reports)
  * [Come connettere e configurare i miei contatti](#how-do-i-connect-and-configure-my-contacts)
  * [Come connettere e configurare i miei calendari](#how-do-i-connect-and-configure-my-calendars)
  * [Come aggiungere più calendari e gestire quelli esistenti](#how-do-i-add-more-calendars-and-manage-existing-calendars)
  * [Come connettere e configurare attività e promemoria](#how-do-i-connect-and-configure-tasks-and-reminders)
  * [Perché non posso creare attività in Promemoria macOS](#why-cant-i-create-tasks-in-macos-reminders)
  * [Come configurare Tasks.org su Android](#how-do-i-set-up-tasksorg-on-android)
  * [Come configurare SRS per Forward Email](#how-do-i-set-up-srs-for-forward-email)
  * [Come configurare MTA-STS per Forward Email](#how-do-i-set-up-mta-sts-for-forward-email)
  * [Come aggiungere una foto profilo al mio indirizzo email](#how-do-i-add-a-profile-picture-to-my-email-address)
* [Funzionalità Avanzate](#advanced-features)
  * [Supportate newsletter o mailing list per email di marketing](#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email)
  * [Supportate l'invio di email tramite API](#do-you-support-sending-email-with-api)
  * [Supportate la ricezione di email con IMAP](#do-you-support-receiving-email-with-imap)
  * [Supportate POP3](#do-you-support-pop3)
  * [Supportate calendari (CalDAV)](#do-you-support-calendars-caldav)
  * [Supportate attività e promemoria (CalDAV VTODO)](#do-you-support-tasks-and-reminders-caldav-vtodo)
  * [Supportate contatti (CardDAV)](#do-you-support-contacts-carddav)
  * [Supportate l'invio di email con SMTP](#do-you-support-sending-email-with-smtp)
  * [Supportate OpenPGP/MIME, crittografia end-to-end ("E2EE") e Web Key Directory ("WKD")](#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)
  * [Supportate la crittografia S/MIME](#do-you-support-smime-encryption)
  * [Supportate il filtraggio email Sieve](#do-you-support-sieve-email-filtering)
  * [Supportate MTA-STS](#do-you-support-mta-sts)
  * [Supportate passkey e WebAuthn](#do-you-support-passkeys-and-webauthn)
  * [Supportate le migliori pratiche email](#do-you-support-email-best-practices)
  * [Supportate webhook per bounce](#do-you-support-bounce-webhooks)
  * [Supportate webhook](#do-you-support-webhooks)
  * [Supportate espressioni regolari o regex](#do-you-support-regular-expressions-or-regex)
  * [Quali sono i vostri limiti SMTP in uscita](#what-are-your-outbound-smtp-limits)
  * [Serve approvazione per abilitare SMTP](#do-i-need-approval-to-enable-smtp)
  * [Quali sono le impostazioni di configurazione del server SMTP](#what-are-your-smtp-server-configuration-settings)
  * [Quali sono le impostazioni di configurazione del server IMAP](#what-are-your-imap-server-configuration-settings)
  * [Quali sono le impostazioni di configurazione del server POP3](#what-are-your-pop3-server-configuration-settings)
  * [Come configurare l'autodiscovery email per il mio dominio](#how-do-i-set-up-email-autodiscovery-for-my-domain)
* [Sicurezza](#security-1)
  * [Tecniche avanzate di rafforzamento del server](#advanced-server-hardening-techniques)
  * [Avete certificazioni SOC 2 o ISO 27001](#do-you-have-soc-2-or-iso-27001-certifications)
  * [Usate la crittografia TLS per l'inoltro email](#do-you-use-tls-encryption-for-email-forwarding)
  * [Preservate gli header di autenticazione email](#do-you-preserve-email-authentication-headers)
  * [Preservate gli header originali delle email e prevenite lo spoofing](#do-you-preserve-original-email-headers-and-prevent-spoofing)
  * [Come proteggete contro spam e abusi](#how-do-you-protect-against-spam-and-abuse)
  * [Conservate il contenuto delle email su disco](#do-you-store-email-content-on-disk)
  * [Il contenuto delle email può essere esposto durante crash di sistema](#can-email-content-be-exposed-during-system-crashes)
  * [Chi ha accesso alla vostra infrastruttura email](#who-has-access-to-your-email-infrastructure)
  * [Quali fornitori di infrastruttura usate](#what-infrastructure-providers-do-you-use)
  * [Offrite un Accordo sul trattamento dei dati (DPA)](#do-you-offer-a-data-processing-agreement-dpa)
  * [Come gestite le notifiche di violazione dati](#how-do-you-handle-data-breach-notifications)
  * [Offrite un ambiente di test](#do-you-offer-a-test-environment)
  * [Fornite strumenti di monitoraggio e allerta](#do-you-provide-monitoring-and-alerting-tools)
  * [Come garantite alta disponibilità](#how-do-you-ensure-high-availability)
  * [Siete conformi alla Sezione 889 del National Defense Authorization Act (NDAA)](#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa)
* [Dettagli di Sistema e Tecnici](#system-and-technical-details)
  * [Conservate email e loro contenuti](#do-you-store-emails-and-their-contents)
  * [Come funziona il vostro sistema di inoltro email](#how-does-your-email-forwarding-system-work)
  * [Come processate un'email per l'inoltro](#how-do-you-process-an-email-for-forwarding)
  * [Come gestite problemi di consegna email](#how-do-you-handle-email-delivery-issues)
  * [Come gestite il blocco dei vostri indirizzi IP](#how-do-you-handle-your-ip-addresses-becoming-blocked)
  * [Cosa sono gli indirizzi postmaster](#what-are-postmaster-addresses)
  * [Cosa sono gli indirizzi no-reply](#what-are-no-reply-addresses)
  * [Quali sono gli indirizzi IP dei vostri server](#what-are-your-servers-ip-addresses)
  * [Avete una allowlist](#do-you-have-an-allowlist)
  * [Quali estensioni di nomi di dominio sono allowlistate di default](#what-domain-name-extensions-are-allowlisted-by-default)
  * [Qual è il vostro criterio per la allowlist](#what-is-your-allowlist-criteria)
  * [Quali estensioni di nomi di dominio possono essere usate gratuitamente](#what-domain-name-extensions-can-be-used-for-free)
  * [Avete una greylist](#do-you-have-a-greylist)
  * [Avete una denylist](#do-you-have-a-denylist)
  * [Avete limitazioni di velocità](#do-you-have-rate-limiting)
  * [Come proteggete contro il backscatter](#how-do-you-protect-against-backscatter)
  * [Prevenire rimbalzi da noti spammer MAIL FROM](#prevent-bounces-from-known-mail-from-spammers)
  * [Prevenire rimbalzi inutili per proteggere contro il backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter)
  * [Come determinate l'impronta digitale di un'email](#how-do-you-determine-an-email-fingerprint)
  * [Posso inoltrare email a porte diverse dalla 25 (es. se il mio ISP ha bloccato la porta 25)](#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25)
  * [Supporta il simbolo più + per alias Gmail](#does-it-support-the-plus--symbol-for-gmail-aliases)
  * [Supporta i sottodomini](#does-it-support-sub-domains)
  * [Inoltra gli header delle mie email](#does-this-forward-my-emails-headers)
  * [È ben testato](#is-this-well-tested)
  * [Passate messaggi e codici di risposta SMTP](#do-you-pass-along-smtp-response-messages-and-codes)
  * [Come prevenite spammer e garantite una buona reputazione di inoltro email](#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation)
  * [Come effettuate ricerche DNS sui nomi di dominio](#how-do-you-perform-dns-lookups-on-domain-names)
* [Account e Fatturazione](#account-and-billing)
  * [Offrite garanzia di rimborso sui piani a pagamento](#do-you-offer-a-money-back-guarantee-on-paid-plans)
  * [Se cambio piano fate il pro-rata e rimborsate la differenza](#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference)
  * [Posso usare questo servizio di inoltro email solo come server MX di "fallback" o "fallover"](#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server)
  * [Posso disabilitare alias specifici](#can-i-disable-specific-aliases)
  * [Posso inoltrare email a più destinatari](#can-i-forward-emails-to-multiple-recipients)
  * [Posso avere più destinatari global catch-all](#can-i-have-multiple-global-catch-all-recipients)
  * [C'è un limite massimo al numero di indirizzi email a cui posso inoltrare per alias](#is-there-a-maximum-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)
  * [Posso inoltrare email ricorsivamente](#can-i-recursively-forward-emails)
  * [Le persone possono registrare o deregistrare il mio inoltro email senza il mio permesso](#can-people-unregister-or-register-my-email-forwarding-without-my-permission)
  * [Com'è gratuito](#how-is-it-free)
  * [Qual è il limite massimo di dimensione email](#what-is-the-max-email-size-limit)
  * [Conservate log delle email](#do-you-store-logs-of-emails)
  * [Conservate log degli errori](#do-you-store-error-logs)
  * [Leggete le mie email](#do-you-read-my-emails)
  * [Posso "inviare mail come" in Gmail con questo](#can-i-send-mail-as-in-gmail-with-this)
  * [Posso "inviare mail come" in Outlook con questo](#can-i-send-mail-as-in-outlook-with-this)
  * [Posso "inviare mail come" in Apple Mail e iCloud Mail con questo](#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this)
  * [Posso inoltrare email illimitate con questo](#can-i-forward-unlimited-emails-with-this)
  * [Offrite domini illimitati a un prezzo unico](#do-you-offer-unlimited-domains-for-one-price)
  * [Quali metodi di pagamento accettate](#which-payment-methods-do-you-accept)
* [Risorse Aggiuntive](#additional-resources)
## Avvio Rapido {#quick-start}

Per iniziare con Forward Email:

1. **Crea un account** su [forwardemail.net/register](https://forwardemail.net/register)

2. **Aggiungi e verifica il tuo dominio** sotto [Il Mio Account → Domini](/my-account/domains)

3. **Aggiungi e configura alias di posta/caselle email** sotto [Il Mio Account → Domini](/my-account/domains) → Alias

4. **Testa la tua configurazione** inviando un'email a uno dei tuoi nuovi alias

> \[!TIP]
> Le modifiche DNS possono impiegare fino a 24-48 ore per propagarsi globalmente, anche se spesso hanno effetto molto prima.

> \[!IMPORTANT]
> Per una migliore deliverability, consigliamo di configurare i record [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) e [DMARC](#how-do-i-set-up-dmarc-for-forward-email).


## Introduzione {#introduction}

### Cos'è Forward Email {#what-is-forward-email}

> \[!NOTE]
> Forward Email è perfetto per privati, piccole imprese e sviluppatori che desiderano indirizzi email professionali senza i costi e la manutenzione di una soluzione completa di hosting email.

Forward Email è un **provider di servizi email completo** e **provider di hosting email per nomi di dominio personalizzati**.

È l'unico servizio gratuito e open source, che ti permette di usare indirizzi email con dominio personalizzato senza la complessità di configurare e mantenere un server email proprio.

Il nostro servizio inoltra le email inviate al tuo dominio personalizzato al tuo account email esistente – e puoi anche usarci come provider dedicato di hosting email.

Caratteristiche principali di Forward Email:

* **Email con Dominio Personalizzato**: Usa indirizzi email professionali con il tuo nome di dominio
* **Piano Gratuito**: Inoltro email base senza costi
* **Privacy Avanzata**: Non leggiamo le tue email né vendiamo i tuoi dati
* **Open Source**: L'intero codice è disponibile su GitHub
* **Supporto SMTP, IMAP e POP3**: Piena capacità di invio e ricezione email
* **Crittografia End-to-End**: Supporto per OpenPGP/MIME
* **Alias Catch-All Personalizzati**: Crea alias email illimitati

Puoi confrontarci con oltre 56 altri provider di servizi email sulla [nostra pagina di confronto email](/blog/best-email-service).

> \[!TIP]
> Scopri di più su Forward Email leggendo il nostro [Whitepaper Tecnico gratuito](/technical-whitepaper.pdf)

### Chi usa Forward Email {#who-uses-forward-email}

Forniamo servizi di hosting email e inoltro email a oltre 500.000 domini e questi utenti di rilievo:

| Cliente                                 | Caso di Studio                                                                                               |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Accademia Navale degli Stati Uniti      | [:page_facing_up: Caso di Studio](/blog/docs/federal-government-email-service-section-889-compliant)         |
| Canonical                                | [:page_facing_up: Caso di Studio](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Netflix Games                            |                                                                                                          |
| The Linux Foundation                     | [:page_facing_up: Caso di Studio](/blog/docs/linux-foundation-email-enterprise-case-study)                   |
| The PHP Foundation                       |                                                                                                          |
| Fox News Radio                           |                                                                                                          |
| Disney Ad Sales                          |                                                                                                          |
| jQuery                                   | [:page_facing_up: Caso di Studio](/blog/docs/linux-foundation-email-enterprise-case-study)                   |
| LineageOS                                |                                                                                                          |
| Ubuntu                                   | [:page_facing_up: Caso di Studio](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Kubuntu                                  | [:page_facing_up: Caso di Studio](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Lubuntu                                  | [:page_facing_up: Caso di Studio](/blog/docs/canonical-ubuntu-email-enterprise-case-study)                   |
| Università di Cambridge                   | [:page_facing_up: Caso di Studio](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Università del Maryland                   | [:page_facing_up: Caso di Studio](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Università di Washington                  | [:page_facing_up: Caso di Studio](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Tufts University                         | [:page_facing_up: Caso di Studio](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Swarthmore College                       | [:page_facing_up: Caso di Studio](/blog/docs/alumni-email-forwarding-university-case-study)                  |
| Governo del South Australia              |                                                                                                          |
| Governo della Repubblica Dominicana      |                                                                                                          |
| Fly<span>.</span>io                      |                                                                                                          |
| RCD Hotels                               |                                                                                                          |
| Isaac Z. Schlueter (npm)                 | [:page_facing_up: Caso di Studio](/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem) |
| David Heinemeier Hansson (Ruby on Rails) |                                                                                                          |
### Qual è la storia di Forward Email {#what-is-forward-emails-history}

Puoi saperne di più su Forward Email nella [nostra pagina Chi siamo](/about).

### Quanto è veloce questo servizio {#how-fast-is-this-service}

> \[!NOTE]
> Il nostro sistema è progettato per velocità e affidabilità, con più server ridondanti per garantire che le tue email vengano consegnate prontamente.

Forward Email consegna i messaggi con un ritardo minimo, tipicamente entro pochi secondi dalla ricezione.

Metriche di performance:

* **Tempo medio di consegna**: meno di 5-10 secondi dalla ricezione all'inoltro ([vedi la nostra pagina di monitoraggio Time to Inbox "TTI"](/tti))
* **Uptime**: disponibilità del servizio superiore al 99,9%
* **Infrastruttura globale**: server posizionati strategicamente per un instradamento ottimale
* **Scalabilità automatica**: il nostro sistema si adatta durante i picchi di traffico email

Operiamo in tempo reale, a differenza di altri provider che si basano su code ritardate.

Non scriviamo su disco né memorizziamo log – con [l'eccezione degli errori](#do-you-store-error-logs) e [SMTP in uscita](#do-you-support-sending-email-with-smtp) (vedi la nostra [Informativa sulla privacy](/privacy)).

Tutto viene gestito in memoria e [il nostro codice sorgente è su GitHub](https://github.com/forwardemail).


## Client di posta {#email-clients}

### Thunderbird {#thunderbird}

1. Crea un nuovo alias e genera una password nella tua dashboard di Forward Email
2. Apri Thunderbird e vai su **Modifica → Impostazioni account → Azioni account → Aggiungi account di posta**
3. Inserisci il tuo nome, l'indirizzo Forward Email e la password
4. Clicca su **Configura manualmente** e inserisci:
   * In arrivo: IMAP, `imap.forwardemail.net`, porta 993, SSL/TLS
   * In uscita: SMTP, `smtp.forwardemail.net`, porta 465, SSL/TLS (consigliato; è supportata anche la porta 587 con STARTTLS)
5. Clicca su **Fine**

### Microsoft Outlook {#microsoft-outlook}

1. Crea un nuovo alias e genera una password nella tua dashboard di Forward Email
2. Vai su **File → Aggiungi account**
3. Inserisci il tuo indirizzo Forward Email e clicca su **Connetti**
4. Scegli **Opzioni avanzate** e seleziona **Consentimi di configurare manualmente il mio account**
5. Seleziona **IMAP** e inserisci:
   * In arrivo: `imap.forwardemail.net`, porta 993, SSL
   * In uscita: `smtp.forwardemail.net`, porta 465, SSL/TLS (consigliato; è supportata anche la porta 587 con STARTTLS)
   * Nome utente: il tuo indirizzo email completo
   * Password: la password generata
6. Clicca su **Connetti**

### Apple Mail {#apple-mail}

1. Crea un nuovo alias e genera una password nella tua dashboard di Forward Email
2. Vai su **Mail → Preferenze → Account → +**
3. Seleziona **Altro account Mail**
4. Inserisci il tuo nome, l'indirizzo Forward Email e la password
5. Per le impostazioni del server, inserisci:
   * In arrivo: `imap.forwardemail.net`
   * In uscita: `smtp.forwardemail.net`
   * Nome utente: il tuo indirizzo email completo
   * Password: la password generata
6. Clicca su **Accedi**

### eM Client {#em-client}

1. Crea un nuovo alias e genera una password nella tua dashboard di Forward Email
2. Apri eM Client e vai su **Menu → Account → + Aggiungi account**
3. Clicca su **Mail** e poi seleziona **Altro**
4. Inserisci il tuo indirizzo Forward Email e clicca su **Avanti**
5. Inserisci le seguenti impostazioni del server:
   * **Server in arrivo**: `imap.forwardemail.net`
   * **Server in uscita**: `smtp.forwardemail.net`
6. Inserisci il tuo indirizzo email completo come **Nome utente** e la password generata come **Password** per entrambi i server in arrivo e in uscita.
7. eM Client testerà la connessione. Una volta superato il test, clicca su **Avanti**.
8. Inserisci il tuo nome e scegli un nome per l'account.
9. Clicca su **Fine**.

### Dispositivi mobili {#mobile-devices}

Per iOS:

1. Vai su **Impostazioni → Mail → Account → Aggiungi account → Altro**
2. Tocca **Aggiungi account Mail** e inserisci i tuoi dati
3. Per le impostazioni del server, usa le stesse impostazioni IMAP e SMTP sopra indicate

Per Android:

1. Vai su **Impostazioni → Account → Aggiungi account → Personale (IMAP)**
2. Inserisci il tuo indirizzo Forward Email e la password
3. Per le impostazioni del server, usa le stesse impostazioni IMAP e SMTP sopra indicate

### Configurazione del relay SMTP Sendmail {#sendmail-smtp-relay-configuration}

Puoi configurare Sendmail per inoltrare le email tramite i server SMTP di Forward Email. Questa è una configurazione comune per sistemi legacy o applicazioni che si affidano a Sendmail.
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tempo stimato per la configurazione:</strong>
  <span>Meno di 20 minuti</span>
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

#### Configurazione {#configuration}

1. Modifica il file `sendmail.mc`, solitamente situato in `/etc/mail/sendmail.mc`:

   ```bash
   sudo nano /etc/mail/sendmail.mc
   ```

2. Aggiungi le seguenti righe per definire lo smart host e l'autenticazione:

   ```
   define(`SMART_HOST', `smtp.forwardemail.net')dnl
   define(`RELAY_MAILER_ARGS', `TCP $h 465')dnl
   define(`confAUTH_MECHANISMS', `EXTERNAL GSSAPI DIGEST-MD5 CRAM-MD5 LOGIN PLAIN')dnl
   FEATURE(`authinfo',`hash -o /etc/mail/authinfo.db')dnl
   ```

3. Crea il file di autenticazione `/etc/mail/authinfo`:

   ```bash
   sudo nano /etc/mail/authinfo
   ```

4. Aggiungi le tue credenziali Forward Email nel file `authinfo`:

   ```
   AuthInfo:smtp.forwardemail.net "U:your-alias@yourdomain.com" "P:your-generated-password" "M:PLAIN"
   ```

5. Genera il database di autenticazione e proteggi i file:

   ```bash
   sudo makemap hash /etc/mail/authinfo < /etc/mail/authinfo
   sudo chmod 600 /etc/mail/authinfo /etc/mail/authinfo.db
   ```

6. Ricostruisci la configurazione di Sendmail e riavvia il servizio:

   ```bash
   sudo make -C /etc/mail
   sudo systemctl restart sendmail
   ```

#### Test {#testing}

Invia una email di prova per verificare la configurazione:

```bash
echo "Email di prova da Sendmail" | mail -s "Test Sendmail" recipient@example.com
```

### Configurazione Exim4 SMTP Relay {#exim4-smtp-relay-configuration}

Exim4 è un MTA popolare su sistemi basati su Debian. Puoi configurarlo per usare Forward Email come smarthost.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tempo stimato per la configurazione:</strong>
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

#### Configurazione {#configuration-1}

1. Avvia lo strumento di configurazione di Exim4:

   ```bash
   sudo dpkg-reconfigure exim4-config
   ```

2. Seleziona le seguenti opzioni:
   * **Tipo generale di configurazione della posta:** posta inviata tramite smarthost; ricevuta via SMTP o fetchmail
   * **Nome del sistema di posta:** your.hostname
   * **Indirizzi IP su cui ascoltare per connessioni SMTP in arrivo:** 127.0.0.1 ; ::1
   * **Altre destinazioni per cui la posta è accettata:** (lascia vuoto)
   * **Domini per cui inoltrare la posta:** (lascia vuoto)
   * **Indirizzo IP o nome host dello smarthost in uscita:** smtp.forwardemail.net::465
   * **Nascondere il nome locale della posta nella posta in uscita?** No
   * **Mantenere il numero di query DNS minimo (Dial-on-Demand)?** No
   * **Metodo di consegna per la posta locale:** formato Mbox in /var/mail/
   * **Dividere la configurazione in file piccoli?** No

3. Modifica il file `passwd.client` per aggiungere le tue credenziali:

   ```bash
   sudo nano /etc/exim4/passwd.client
   ```

4. Aggiungi la seguente riga:

   ```
   smtp.forwardemail.net:your-alias@yourdomain.com:your-generated-password
   ```

5. Aggiorna la configurazione e riavvia Exim4:

   ```bash
   sudo update-exim4.conf
   sudo systemctl restart exim4
   ```

#### Test {#testing-1}

Invia una email di prova:

```bash
echo "Test da Exim4" | mail -s "Test Exim4" recipient@example.com
```

### Configurazione client SMTP msmtp {#msmtp-smtp-client-configuration}

msmtp è un client SMTP leggero utile per inviare email da script o applicazioni da linea di comando.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tempo stimato per la configurazione:</strong>
  <span>Meno di 10 minuti</span>
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

#### Configurazione {#configuration-2}

1. Crea o modifica il file di configurazione msmtp in `~/.msmtprc`:

   ```bash
   nano ~/.msmtprc
   ```

2. Aggiungi la seguente configurazione:

   ```
   defaults
   auth           on
   tls            on
   tls_trust_file /etc/ssl/certs/ca-certificates.crt
   logfile        ~/.msmtp.log

   account        forwardemail
   host           smtp.forwardemail.net
   port           465
   tls_starttls   off
   from           your-alias@yourdomain.com
   user           your-alias@yourdomain.com
   password       your-generated-password

   account default : forwardemail
   ```

3. Imposta i permessi corretti per il file di configurazione:

   ```bash
   chmod 600 ~/.msmtprc
   ```

#### Test {#testing-2}

Invia una email di prova:

```bash
echo "This is a test email from msmtp" | msmtp -a default recipient@example.com
```

### Client email da riga di comando {#command-line-email-clients}

Client email da riga di comando popolari come [Mutt](https://gitlab.com/muttmua/mutt), [NeoMutt](https://neomutt.org) e [Alpine](https://alpine.x10.mx/alpine/release/) possono essere configurati per usare i server SMTP di Forward Email per l'invio della posta. La configurazione sarà simile a quella di `msmtp`, dove fornisci i dettagli del server SMTP e le tue credenziali nei rispettivi file di configurazione (`.muttrc`, `.neomuttrc` o `.pinerc`).

### Configurazione email per Windows {#windows-email-configuration}

Per gli utenti Windows, puoi configurare client email popolari come **Microsoft Outlook** ed **eM Client** utilizzando le impostazioni IMAP e SMTP fornite nel tuo account Forward Email. Per uso da riga di comando o scripting, puoi usare il cmdlet PowerShell `Send-MailMessage` (anche se è considerato obsoleto) o uno strumento leggero di relay SMTP come [E-MailRelay](https://github.com/graeme-walker/emailrelay).

### Configurazione relay SMTP Postfix {#postfix-smtp-relay-configuration}

Puoi configurare Postfix per inoltrare le email tramite i server SMTP di Forward Email. Questo è utile per applicazioni server che devono inviare email.

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tempo stimato per la configurazione:</strong>
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

2. Durante l'installazione, seleziona "Internet Site" quando richiesto il tipo di configurazione.

#### Configurazione {#configuration-3}

1. Modifica il file principale di configurazione di Postfix:

```bash
sudo nano /etc/postfix/main.cf
```

2. Aggiungi o modifica queste impostazioni:

```
# Configurazione relay SMTP
relayhost = [smtp.forwardemail.net]:465
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_sasl_auth_enable = yes
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
smtp_sasl_security_options = noanonymous
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

3. Crea il file delle password SASL:

```bash
sudo nano /etc/postfix/sasl_passwd
```

4. Aggiungi le tue credenziali Forward Email:

```
[smtp.forwardemail.net]:465 your-alias@yourdomain.com:your-generated-password
```

5. Proteggi e indicizza il file delle password:

```bash
sudo chmod 600 /etc/postfix/sasl_passwd
sudo postmap /etc/postfix/sasl_passwd
```

6. Riavvia Postfix:

```bash
sudo systemctl restart postfix
```

#### Test {#testing-3}

Testa la configurazione inviando una email di prova:

```bash
echo "Test email body" | mail -s "Test Subject" recipient@example.com
```

### Come inviare mail come usando Gmail {#how-to-send-mail-as-using-gmail}
<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tempo stimato per la configurazione:</strong>
  <span>Meno di 10 minuti</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Per iniziare:
  </strong>
  <span>
    Se hai seguito le istruzioni sopra in <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Come iniziare e configurare l'inoltro email</a>, puoi continuare a leggere qui sotto.
  </span>
</div>

<div id="send-mail-as-content">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Assicurati di aver letto i nostri <a href="/terms" class="alert-link" target="_blank">Termini</a>, <a href="/privacy" class="alert-link" target="_blank">Informativa sulla privacy</a> e <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limiti SMTP in uscita</a> &ndash; il tuo utilizzo è considerato accettazione e accordo.
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

1. Vai su <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Impostazioni <i class="fa fa-angle-right"></i> Configurazione SMTP in uscita e segui le istruzioni di configurazione

2. Crea un nuovo alias per il tuo dominio sotto <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Il mio account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Alias (es. <code><hello@example.com></code>)

3. Clicca su <strong class="text-success"><i class="fa fa-key"></i> Genera password</strong> accanto al nuovo alias creato. Copia negli appunti e conserva in modo sicuro la password generata mostrata a schermo.

4. Vai su [Gmail](https://gmail.com) e sotto [Impostazioni <i class="fa fa-angle-right"></i> Account e importazione <i class="fa fa-angle-right"></i> Invia messaggio come](https://mail.google.com/mail/u/0/#settings/accounts), clicca su "Aggiungi un altro indirizzo email"

5. Quando richiesto "Nome", inserisci il nome che vuoi venga mostrato come mittente (es. "Linus Torvalds").

6. Quando richiesto "Indirizzo email", inserisci l'indirizzo email completo di un alias creato sotto <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Il mio account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Alias (es. <code><hello@example.com></code>)

7. Deseleziona "Tratta come alias"

8. Clicca su "Passaggio successivo" per procedere

9. Quando richiesto "Server SMTP", inserisci <code>smtp.forwardemail.net</code> e cambia la porta in <code>465</code>

10. Quando richiesto "Nome utente", inserisci l'indirizzo email completo di un alias creato sotto <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Il mio account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Alias (es. <code><hello@example.com></code>)

11. Quando richiesto "Password", incolla la password da <strong class="text-success"><i class="fa fa-key"></i> Genera password</strong> al punto 3 sopra

12. Seleziona il pulsante radio per "Connessione sicura tramite SSL"

13. Clicca su "Aggiungi account" per procedere

14. Apri una nuova scheda su [Gmail](https://gmail.com) e attendi l'arrivo della email di verifica (riceverai un codice di verifica che conferma che sei il proprietario dell'indirizzo email che stai tentando di "Inviare come")

15. Una volta ricevuto, copia e incolla il codice di verifica nel prompt ricevuto nel passaggio precedente
16. Una volta fatto ciò, torna all'email e clicca sul link per "confermare la richiesta". Molto probabilmente dovrai eseguire questo passaggio e il precedente affinché l'email sia configurata correttamente.

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

### Cos'è la guida legacy free per Inviare Mail Come usando Gmail {#what-is-the-legacy-free-guide-for-send-mail-as-using-gmail}

<div class="alert my-3 alert-danger"><i class="fa fa-stop-circle font-weight-bold"></i> <strong class="font-weight-bold">Importante:</strong> Questa guida legacy free è deprecata da maggio 2023 poiché <a class="alert-link" href="/faq#do-you-support-sending-email-with-smtp">ora supportiamo l'SMTP in uscita</a>. Se usi la guida qui sotto, <a class="alert-link" href="/faq#can-i-remove-the-via-forwardemail-dot-net-in-gmail">questo farà apparire la tua email in uscita</a> con la dicitura "<span class="notranslate text-danger font-weight-bold">via forwardemail dot net</span>" in Gmail.</a></div>

<div class="alert mb-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tempo stimato per la configurazione:</strong>
  <span>Meno di 10 minuti</span>
</div>

<div class="alert mb-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Per iniziare:
  </strong>
  <span>
    Se hai seguito le istruzioni sopra in <a href="#how-do-i-get-started-and-set-up-email-forwarding" class="alert-link">Come iniziare e configurare l'inoltro email</a>, puoi continuare a leggere qui sotto.
  </span>
</div>

<div class="mx-auto lazyframe lazyframe-bordered border border-themed mb-3" data-vendor="youtube_nocookie" title="Come Inviare Mail Come usando Gmail" data-src="https://www.youtube-nocookie.com/embed/MEheS8gM4Xs?autoplay=0"></div>

<div id="legacy-free-guide">

1. Devi avere abilitata la [Autenticazione a Due Fattori di Gmail][gmail-2fa] perché questo funzioni. Visita <https://www.google.com/landing/2step/> se non l'hai abilitata.

2. Una volta abilitata l'Autenticazione a Due Fattori (o se era già abilitata), visita <https://myaccount.google.com/apppasswords>.

3. Quando ti viene chiesto di "Selezionare l'app e il dispositivo per cui vuoi generare la password dell'app":
   * Seleziona "Mail" nel menu a tendina "Seleziona app"
   * Seleziona "Altro" nel menu a tendina "Seleziona dispositivo"
   * Quando ti viene chiesto di inserire un testo, inserisci l'indirizzo email del tuo dominio personalizzato da cui stai inoltrando (es. <code><hello@example.com></code> - questo ti aiuterà a tenere traccia nel caso usassi questo servizio per più account)

4. Copia la password generata automaticamente negli appunti
   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Importante:
     </strong>
     <span>
       Se usi G Suite, visita il pannello di amministrazione <a class="alert-link" href="https://admin.google.com/AdminHome#ServiceSettings/service=email&subtab=filters" rel="noopener noreferrer" target="_blank">App <i class="fa fa-angle-right"></i> G Suite <i class="fa fa-angle-right"></i> Impostazioni per Gmail <i class="fa fa-angle-right"></i> Impostazioni</a> e assicurati di selezionare "Consenti agli utenti di inviare posta tramite un server SMTP esterno...". Ci sarà un po' di ritardo prima che questa modifica venga attivata, quindi attendi qualche minuto.
     </span>
   </div>

5. Vai su [Gmail](https://gmail.com) e sotto [Impostazioni <i class="fa fa-angle-right"></i> Account e importazione <i class="fa fa-angle-right"></i> Invia messaggio come](https://mail.google.com/mail/u/0/#settings/accounts), clicca su "Aggiungi un altro indirizzo email"

6. Quando ti viene chiesto "Nome", inserisci il nome che vuoi venga mostrato come mittente (es. "Linus Torvalds")

7. Quando ti viene chiesto "Indirizzo email", inserisci l'indirizzo email con il dominio personalizzato che hai usato sopra (es. <code><hello@example.com></code>)
8. Deseleziona "Tratta come alias"

9. Clicca su "Passo successivo" per procedere

10. Quando richiesto per "Server SMTP", inserisci <code>smtp.gmail.com</code> e lascia la porta su <code>587</code>

11. Quando richiesto per "Nome utente", inserisci la parte del tuo indirizzo Gmail senza la parte <span>gmail.com</span> (es. solo "user" se la mia email è <span><user@gmail.com></span>)
    <div class="alert my-3 alert-primary">
      <i class="fa fa-info-circle font-weight-bold"></i>
      <strong class="font-weight-bold">
        Importante:
      </strong>
      <span>
        Se la parte "Nome utente" è compilata automaticamente, allora <u><strong>dovrai cambiarla</strong></u> con la parte nome utente del tuo indirizzo Gmail.
      </span>
    </div>

12. Quando richiesto per "Password", incolla dagli appunti la password che hai generato al punto 2 sopra

13. Lascia selezionato il pulsante radio per "Connessione sicura usando TLS"

14. Clicca su "Aggiungi account" per procedere

15. Apri una nuova scheda su [Gmail](https://gmail.com) e attendi l'arrivo della tua email di verifica (riceverai un codice di verifica che conferma che sei il proprietario dell'indirizzo email che stai tentando di "Inviare come")

16. Una volta ricevuto, copia e incolla il codice di verifica al prompt che hai ricevuto nel passaggio precedente

17. Dopo aver fatto ciò, torna all'email e clicca sul link per "confermare la richiesta". Molto probabilmente dovrai eseguire questo passaggio e quello precedente affinché l'email sia configurata correttamente.

</div>

### Configurazione avanzata del routing Gmail {#advanced-gmail-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tempo stimato per la configurazione:</strong>
  <span>15-30 minuti</span>
</div>

Se vuoi configurare un routing avanzato in Gmail in modo che gli alias che non corrispondono a una casella di posta vengano inoltrati agli scambi di posta di Forward Email, segui questi passaggi:

1. Accedi alla console di amministrazione Google su [admin.google.com](https://admin.google.com)
2. Vai su **App → Google Workspace → Gmail → Routing**
3. Clicca su **Aggiungi percorso** e configura le seguenti impostazioni:

**Impostazioni destinatario singolo:**

* Seleziona "Cambia destinatario della busta" e inserisci il tuo indirizzo Gmail principale
* Seleziona "Aggiungi intestazione X-Gm-Original-To con destinatario originale"

**Modelli destinatario della busta:**

* Aggiungi un modello che corrisponde a tutte le caselle inesistenti (es. `.*@tuodominio.com`)

**Impostazioni server email:**

* Seleziona "Inoltra a host" e inserisci `mx1.forwardemail.net` come server primario
* Aggiungi `mx2.forwardemail.net` come server di backup
* Imposta la porta su 25
* Seleziona "Richiedi TLS" per la sicurezza

4. Clicca su **Salva** per creare il percorso

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Questa configurazione funzionerà solo per account Google Workspace con domini personalizzati, non per account Gmail normali.
  </span>
</div>

### Configurazione avanzata del routing Outlook {#advanced-outlook-routing-configuration}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tempo stimato per la configurazione:</strong>
  <span>15-30 minuti</span>
</div>

Per gli utenti Microsoft 365 (ex Office 365) che vogliono configurare un routing avanzato in modo che gli alias che non corrispondono a una casella di posta vengano inoltrati agli scambi di posta di Forward Email:

1. Accedi al centro di amministrazione Microsoft 365 su [admin.microsoft.com](https://admin.microsoft.com)
2. Vai su **Exchange → Flusso di posta → Regole**
3. Clicca su **Aggiungi una regola** e seleziona **Crea una nuova regola**
4. Dai un nome alla regola (es. "Inoltra caselle inesistenti a Forward Email")
5. Sotto **Applica questa regola se**, seleziona:
   * "L'indirizzo del destinatario corrisponde a..."
   * Inserisci un modello che corrisponde a tutti gli indirizzi del tuo dominio (es. `*@tuodominio.com`)
6. Sotto **Esegui le seguenti azioni**, seleziona:
   * "Reindirizza il messaggio a..."
   * Scegli "Il seguente server di posta"
   * Inserisci `mx1.forwardemail.net` e porta 25
   * Aggiungi `mx2.forwardemail.net` come server di backup
7. Sotto **Tranne se**, seleziona:
   * "Il destinatario è..."
   * Aggiungi tutte le tue caselle esistenti che non devono essere inoltrate
8. Imposta la priorità della regola per assicurarti che venga eseguita dopo le altre regole di flusso di posta
9. Clicca su **Salva** per attivare la regola
## Risoluzione dei problemi {#troubleshooting}

### Perché non ricevo le mie email di prova {#why-am-i-not-receiving-my-test-emails}

Se stai inviando un'email di prova a te stesso, potrebbe non comparire nella tua casella di posta perché ha lo stesso header "Message-ID".

Questo è un problema ampiamente noto, che interessa anche servizi come Gmail.  <a href="https://support.google.com/a/answer/1703601">Qui trovi la risposta ufficiale di Gmail riguardo a questo problema</a>.

Se continui ad avere problemi, molto probabilmente si tratta di un problema di propagazione DNS.  Dovrai aspettare un po' più a lungo e riprovare (o provare a impostare un valore TTL più basso sui tuoi record <strong class="notranslate">TXT</strong>).

**Ancora problemi?**  Per favore <a href="/help">contattaci</a> così possiamo aiutarti a indagare il problema e trovare una soluzione rapida.

### Come configurare il mio client di posta per funzionare con Forward Email {#how-do-i-configure-my-email-client-to-work-with-forward-email}

<div class="mb-3">
  Il nostro servizio funziona con client di posta popolari come:
  <ul class="ml-1 h4 d-inline list-inline mb-0 pl-0">
    <li class="list-inline-item"><a href="/blog/open-source/apple-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Apple&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/windows-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Windows&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/android-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-android"></i> Android&trade;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/linux-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-linux"></i> Linux&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/desktop-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-desktop"></i> Desktop</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/mozilla-firefox-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-firefox-browser"></i> Mozilla Firefox&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/safari-email-clients" target="_blank" class="badge badge-light bg-light text-dark">Safari&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/google-chrome-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fab fa-chrome"></i> Google Chrome&reg;</a></li>
    <li class="list-inline-item"><a href="/blog/open-source/terminal-email-clients" target="_blank" class="badge badge-light bg-light text-dark"><i class="fas fa-terminal"></i> Terminal</a></li>
  </ul>
</div>

<div class="alert alert-primary">
  Il tuo nome utente è l'indirizzo email del tuo alias e la password è quella generata da <strong class="text-success"><i class="fa fa-key"></i> Genera Password</strong> ("Password Normale").
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Suggerimento:
  </strong>
  <span>Se usi Thunderbird, assicurati che "Sicurezza della connessione" sia impostata su "SSL/TLS" e il metodo di autenticazione su "Password normale".</span>
</div>

| Tipo |         Hostname        |         Protocollo        |                                            Porte                                           |
| :--: | :---------------------: | :-----------------------: | :----------------------------------------------------------------------------------------: |
| IMAP | `imap.forwardemail.net` |  SSL/TLS **Preferito**    |                                      `993` e `2993`                                      |
| SMTP | `smtp.forwardemail.net` | SSL/TLS **Consigliato**   | `465` e `2465` per SSL/TLS (consigliato) o `587`, `2587`, `2525` e `25` per STARTTLS |

### Perché le mie email finiscono in Spam e Posta Indesiderata e come posso controllare la reputazione del mio dominio {#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation}
Questa sezione ti guida se la tua posta in uscita utilizza i nostri server SMTP (ad es. `smtp.forwardemail.net`) (o inoltrata tramite `mx1.forwardemail.net` o `mx2.forwardemail.net`) e viene consegnata nella cartella Spam o Posta indesiderata dei destinatari.

Monitoriamo regolarmente i nostri [indirizzi IP](#what-are-your-servers-ip-addresses) contro [tutte le liste DNS di blocco affidabili](#how-do-you-handle-your-ip-addresses-becoming-blocked), **quindi è molto probabile che si tratti di un problema specifico di reputazione del dominio**.

Le email possono finire nelle cartelle spam per diversi motivi:

1. **Autenticazione mancante**: configura i record [SPF](#how-do-i-set-up-spf-for-forward-email), [DKIM](#how-do-i-set-up-dkim-for-forward-email) e [DMARC](#how-do-i-set-up-dmarc-for-forward-email).

2. **Reputazione del dominio**: i domini nuovi spesso hanno una reputazione neutra finché non stabiliscono una storia di invio.

3. **Trigger nel contenuto**: alcune parole o frasi possono attivare i filtri antispam.

4. **Modelli di invio**: aumenti improvvisi nel volume delle email possono sembrare sospetti.

Puoi provare a utilizzare uno o più di questi strumenti per verificare la reputazione e la categorizzazione del tuo dominio:

#### Strumenti per il controllo della reputazione e delle blacklist {#reputation-and-blocklist-check-tools}

| Nome Strumento                             | URL                                                          | Tipo                   |
| ----------------------------------------- | ------------------------------------------------------------ | ---------------------- |
| Cloudflare Domain Categorization Feedback | <https://radar.cloudflare.com/domains/feedback>              | Categorizzazione       |
| Spamhaus IP and Domain Reputation Checker | <https://check.spamhaus.org/>                                | DNSBL                  |
| Cisco Talos IP and Domain Reputation Center | <https://talosintelligence.com/reputation_center>            | Reputazione            |
| Barracuda IP and Domain Reputation Lookup | <https://www.barracudacentral.org/lookups/lookup-reputation> | DNSBL                  |
| MX Toolbox Blacklist Check                | <https://mxtoolbox.com/blacklists.aspx>                      | Blacklist              |
| Google Postmaster Tools                   | <https://www.gmail.com/postmaster/>                          | Reputazione            |
| Yahoo Sender Hub                          | <https://senders.yahooinc.com/>                              | Reputazione            |
| MultiRBL.valli.org Blacklist Check        | <https://multirbl.valli.org/lookup/>                         | DNSBL                  |
| Sender Score                              | <https://senderscore.org/act/blocklist-remover/>             | Reputazione            |
| Invaluement                               | <https://www.invaluement.com/lookup/>                        | DNSBL                  |
| SURBL                                     | <https://www.surbl.org/>                                     | DNSBL                  |
| SpamCop                                   | <https://www.spamcop.net/bl.shtml>                           | DNSBL                  |
| UCEPROTECT's Levels 1, 2, and 3           | <https://www.uceprotect.net/en/rblcheck.php>                 | DNSBL                  |
| UCEPROTECT's backscatterer.org            | <https://www.backscatterer.org/>                             | Protezione Backscatter |
| UCEPROTECT's whitelisted.org              | <https://www.whitelisted.org/> (richiede un pagamento)       | DNSWL                  |

#### Moduli di richiesta di rimozione IP per provider {#ip-removal-request-forms-by-provider}

Se il tuo indirizzo IP è stato bloccato da un provider email specifico, utilizza il modulo di rimozione appropriato o contatta i riferimenti qui sotto:

| Provider                               | Modulo di Rimozione / Contatto                                                                                 | Note                                         |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Google/Gmail                           | <https://support.google.com/mail/contact/bulk_send_new>                                                        | Modulo di contatto per mittenti bulk         |
| Microsoft (Outlook/Office 365/Hotmail) | <https://sender.office.com>                                                                                    | Portale di delisting IP Office 365           |
| Yahoo/AOL/Verizon                      | <https://senders.yahooinc.com/>                                                                                | Yahoo Sender Hub                             |
| Apple/iCloud                           | <https://ipcheck.proofpoint.com/>                                                                              | Apple usa Proofpoint per la reputazione IP   |
| Proofpoint                             | <https://ipcheck.proofpoint.com/>                                                                              | Controllo e rimozione IP Proofpoint          |
| Barracuda Networks                     | <https://www.barracudacentral.org/lookups/lookup-reputation>                                                   | Controllo e rimozione reputazione Barracuda  |
| Cloudmark                              | <https://csi.cloudmark.com/en/reset/>                                                                          | Richiesta di reset Cloudmark CSI              |
| GoDaddy/SecureServer                   | <https://unblock.secureserver.net>                                                                             | Modulo di richiesta sblocco IP GoDaddy       |
| Comcast/Xfinity                        | <https://spa.xfinity.com/report>                                                                               | Richiesta di rimozione IP Comcast             |
| Charter/Spectrum                       | <https://www.spectrum.net/support/internet/understanding-email-error-codes>                                    | Contatta il supporto Spectrum per la rimozione |
| AT&T                                   | `abuse_rbl@abuse-att.net`                                                                                      | Email per richiesta di rimozione              |
| Cox Communications                     | `unblock.request@cox.net`                                                                                      | Email per richiesta di rimozione              |
| CenturyLink/Lumen                      | `abuse@centurylink.com`                                                                                        | Usa Cloudfilter                               |
| Windstream                             | `abuse@windstream.net`                                                                                         | Email per richiesta di rimozione              |
| t-online.de (Germania)                 | `tobr@rx.t-online.de`                                                                                          | Email per richiesta di rimozione              |
| Orange France                         | <https://postmaster.orange.fr/>                                                                                | Usa modulo di contatto o email `abuse@orange.fr` |
| GMX                                    | <https://postmaster.gmx.net/en/contact>                                                                        | Modulo di contatto postmaster GMX             |
| Mail.ru                                | <https://postmaster.mail.ru/>                                                                                  | Portale postmaster Mail.ru                     |
| Yandex                                 | <https://postmaster.yandex.ru/>                                                                                | Portale postmaster Yandex                      |
| QQ Mail (Tencent)                      | <https://open.mail.qq.com/>                                                                                    | Applicazione whitelist QQ Mail (Cinese)       |
| Netease (163.com)                      | <https://mail.163.com/postmaster/>                                                                             | Portale postmaster Netease                     |
| Alibaba/Aliyun/HiChina                 | <https://www.alibabacloud.com/help/en/alibaba-mail/>                                                           | Contatto tramite console Alibaba Cloud        |
| Amazon SES                             | <https://docs.aws.amazon.com/ses/latest/dg/faqs-dnsbls.html>                                                   | Console AWS SES > Rimozione blacklist         |
| SendGrid                               | <https://support.sendgrid.com/>                                                                                | Contatta il supporto SendGrid                  |
| Mimecast                               | <https://community.mimecast.com/>                                                                              | Usa RBL di terze parti - contatta RBL specifiche |
| Fastmail                               | <https://www.fastmail.com/support/>                                                                            | Contatta il supporto Fastmail                  |
| Zoho                                   | <https://help.zoho.com/portal/en/kb/campaigns/faqs/campaign-review/articles/how-do-i-delist-my-ip-address>     | Contatta il supporto Zoho                       |
| ProtonMail                             | <https://proton.me/support/contact>                                                                            | Contatta il supporto Proton                     |
| Tutanota                               | <https://tutanota.com/support>                                                                                 | Contatta il supporto Tutanota                   |
| Hushmail                               | <https://www.hushmail.com/support/>                                                                            | Contatta il supporto Hushmail                   |
| Mailbox.org                            | <https://mailbox.org/en/support>                                                                               | Contatta il supporto Mailbox.org                |
| Posteo                                 | <https://posteo.de/en/site/contact>                                                                            | Contatta il supporto Posteo                      |
| DuckDuckGo Email                       | <https://duckduckgo.com/email/support>                                                                         | Contatta il supporto DuckDuckGo                  |
| Sonic.net                              | <https://www.sonic.com/support>                                                                                | Contatta il supporto Sonic                        |
| Telus                                  | <https://www.telus.com/en/support>                                                                             | Contatta il supporto Telus                        |
| Vodafone Germany                       | <https://www.vodafone.de/hilfe/>                                                                               | Contatta il supporto Vodafone                     |
| Xtra (Spark NZ)                        | <https://www.spark.co.nz/help/>                                                                                | Contatta il supporto Spark NZ                      |
| UOL/BOL (Brasile)                     | <https://ajuda.uol.com.br/>                                                                                    | Contatta il supporto UOL (portoghese)             |
| Libero (Italia)                       | <https://aiuto.libero.it/>                                                                                     | Contatta il supporto Libero (italiano)            |
| Telenet (Belgio)                     | <https://www2.telenet.be/en/support/>                                                                          | Contatta il supporto Telenet                       |
| Facebook/WhatsApp                    | <https://www.facebook.com/business/help>                                                                       | Contatta il supporto business Facebook            |
| LinkedIn                             | <https://www.linkedin.com/help/linkedin>                                                                       | Contatta il supporto LinkedIn                       |
| Groups.io                            | <https://groups.io/helpcenter>                                                                                 | Contatta il supporto Groups.io                       |
| Earthlink/Vade Secure                | <https://sendertool.vadesecure.com/en/>                                                                        | Strumento mittenti Vade Secure                      |
| Cloudflare Email Security            | <https://www.cloudflare.com/products/zero-trust/email-security/>                                               | Contatta il supporto Cloudflare                      |
| Hornetsecurity/Expurgate             | <https://www.hornetsecurity.com/>                                                                              | Contatta il supporto Hornetsecurity                  |
| SpamExperts/Antispamcloud            | <https://www.spamexperts.com/>                                                                                 | Contatta tramite provider hosting                    |
| Mail2World                         | <https://www.mail2world.com/support/>                                                                          | Contatta il supporto Mail2World                        |
> \[!TIP]
> Inizia con un basso volume di email di alta qualità per costruire una reputazione positiva prima di inviare in volumi maggiori.

> \[!IMPORTANT]
> Se il tuo dominio è in una blacklist, ogni blacklist ha il proprio processo di rimozione. Controlla i loro siti web per le istruzioni.

> \[!TIP]
> Se hai bisogno di ulteriore aiuto o scopri che siamo segnalati come falso positivo come spam da un certo provider di servizi email, allora per favore <a href="/help">contattaci</a>.

### Cosa devo fare se ricevo email di spam {#what-should-i-do-if-i-receive-spam-emails}

Dovresti annullare l'iscrizione dalla lista di distribuzione (se possibile) e bloccare il mittente.

Per favore non segnalarlo come spam, ma inoltralo invece al nostro sistema di prevenzione abusi curato manualmente e attento alla privacy.

**L'indirizzo email a cui inoltrare lo spam è:** <abuse@forwardemail.net>

### Perché le mie email di test inviate a me stesso in Gmail appaiono come "sospette" {#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious}

Se vedi questo messaggio di errore in Gmail quando ti invii un test, o quando una persona con cui stai comunicando con il tuo alias vede un'email da te per la prima volta, allora **per favore non preoccuparti** – poiché questa è una funzione di sicurezza integrata di Gmail.

Puoi semplicemente cliccare su "Sembra sicuro". Per esempio, se inviassi un messaggio di test usando la funzione invia come (a qualcun altro), allora loro non vedranno questo messaggio.

Tuttavia, se lo vedono, è perché erano abituati a vedere le tue email provenire da <john@gmail.com> invece che da <john@customdomain.com> (solo un esempio). Gmail avviserà gli utenti solo per assicurarsi che tutto sia sicuro, non c'è una soluzione alternativa.

### Posso rimuovere il via forwardemail dot net in Gmail {#can-i-remove-the-via-forwardemail-dot-net-in-gmail}

Questo argomento è relativo a un [problema noto in Gmail dove appare info extra accanto al nome del mittente](https://support.google.com/mail/answer/1311182).

Da maggio 2023 supportiamo l'invio di email con SMTP come componente aggiuntivo per tutti gli utenti a pagamento – il che significa che puoi rimuovere il <span class="notranslate">via forwardemail dot net</span> in Gmail.

Nota che questo argomento FAQ è specifico per chi usa la funzione [Come inviare mail come usando Gmail](#how-to-send-mail-as-using-gmail).

Consulta la sezione su [Supportate l'invio di email con SMTP](#do-you-support-sending-email-with-smtp) per le istruzioni di configurazione.


## Gestione dei dati {#data-management}

### Dove si trovano i vostri server {#where-are-your-servers-located}

> \[!TIP]
> Potremmo presto annunciare la nostra sede del datacenter UE ospitata sotto [forwardemail.eu](https://forwardemail.eu). Iscriviti alla discussione su <https://github.com/orgs/forwardemail/discussions/336> per aggiornamenti.

I nostri server si trovano principalmente a Denver, Colorado – vedi <https://forwardemail.net/ips> per la lista completa dei nostri indirizzi IP.

Puoi conoscere i nostri subprocessori sulle nostre pagine [GDPR](/gdpr), [DPA](/dpa) e [Privacy](/privacy).

### Come posso esportare e fare il backup della mia casella di posta {#how-do-i-export-and-backup-my-mailbox}

In qualsiasi momento puoi esportare le tue caselle di posta in formati [EML](https://en.wikipedia.org/wiki/Email#Filename_extensions), [Mbox](https://en.wikipedia.org/wiki/Mbox) o [SQLite](https://en.wikipedia.org/wiki/SQLite) criptati.

Vai su <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Alias <i class="fa fa-angle-right"></i> Scarica Backup e seleziona il formato di esportazione preferito.

Ti verrà inviato via email un link per scaricare l'esportazione una volta terminata.

Nota che questo link per il download dell'esportazione scade dopo 4 ore per motivi di sicurezza.

Se hai bisogno di ispezionare i tuoi formati esportati EML o Mbox, questi strumenti open-source potrebbero essere utili:

| Nome            | Formato | Piattaforma  | URL GitHub                                          |
| --------------- | :-----: | ------------ | -------------------------------------------------- |
| MBox Viewer     |  Mbox   | Windows      | <https://github.com/eneam/mboxviewer>              |
| mbox-web-viewer |  Mbox   | Tutte le piattaforme | <https://github.com/PHMRanger/mbox-web-viewer>     |
| EmlReader       |   EML   | Windows      | <https://github.com/ayamadori/EmlReader>           |
| Email viewer    |   EML   | VSCode       | <https://github.com/joelharkes/vscode_email_viewer>|
| eml-reader      |   EML   | Tutte le piattaforme | <https://github.com/s0ph1e/eml-reader>             |
Inoltre, se hai bisogno di convertire un file Mbox in file EML, puoi utilizzare <https://github.com/noelmartinon/mboxzilla>.

### Come importo e migro la mia casella di posta esistente {#how-do-i-import-and-migrate-my-existing-mailbox}

Puoi facilmente importare la tua email su Forward Email (ad esempio usando [Thunderbird](https://www.thunderbird.net)) con le istruzioni seguenti:

<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Devi seguire tutti i passaggi seguenti per importare la tua email esistente.
  </span>
</div>

1. Esporta la tua email dal tuo provider di posta elettronica esistente:

   | Provider Email | Formato di Esportazione                        | Istruzioni per l'Esportazione                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
   | -------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Gmail          | MBOX                                           | <https://takeout.google.com/settings/takeout/custom/gmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
   | Outlook        | PST                                            | <div class="alert my-3 alert-danger"><i class="fa fa-info-circle font-weight-bold"></i> <strong class="font-weight-bold">Suggerimento:</strong> <span>Se usi Outlook (<a href="https://support.microsoft.com/en-us/office/back-up-your-email-e5845b0b-1aeb-424f-924c-aa1c33b18833#:~:text=Select%20File%20%3E%20Open%20%26%20Export%20%3E,back%20up%20and%20select%20Next." class="alert-link">formato di esportazione PST</a>), puoi semplicemente seguire le istruzioni sotto "Altro" qui sotto. Tuttavia, abbiamo fornito link per convertire PST in formato MBOX/EML in base al tuo sistema operativo:<ul class="mb-0 mt-3"><li><a class="alert-link" href="https://github.com/BaselineIT/Zinkuba/releases/download/release-1.2/Zinkuba.App.exe">Zinkuba per Windows</a> (<a class="alert-link" href="https://github.com/BaselineIT/Zinkuba?tab=readme-ov-file#zinkuba">GitHub</a>)</li><li><a class="alert-link" href="https://cygwin.com/packages/summary/readpst.html">readpst per Windows cygwin</a> – (ad esempio <code>readpst -u -o $OUT_DIR $IN_DIR</code> sostituendo <code>$OUT_DIR</code> e <code>$IN_DIR</code> con i percorsi della directory di output e input rispettivamente).</li><li><a class="alert-link" href="https://manpages.ubuntu.com/manpages/trusty/man1/readpst.1.html">readpst per Ubuntu/Linux</a> – (ad esempio <code>sudo apt-get install readpst</code> e poi <code>readpst -u -o $OUT_DIR $IN_DIR</code>, sostituendo <code>$OUT_DIR</code> e <code>$IN_DIR</code> con i percorsi della directory di output e input rispettivamente).</li><li><a class="alert-link" href="https://formulae.brew.sh/formula/libpst">readpst per macOS (tramite brew)</a> – (ad esempio <code>brew install libpst</code> e poi <code>readpst -u -o $OUT_DIR $IN_DIR</code>, sostituendo <code>$OUT_DIR</code> e <code>$IN_DIR</code> con i percorsi della directory di output e input rispettivamente).</li><li><a class="alert-link" href="https://github.com/juanirm/pst-converter/tree/master?tab=readme-ov-file#pst-converter">PST Converter per Windows (GitHub)</a></li></ul><br /></span></div> |
   | Apple Mail     | MBOX                                           | <https://support.apple.com/guide/mail/import-or-export-mailboxes-mlhlp1030/mac#apd37a3190755974>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Fastmail       | EML                                            | <https://www.fastmail.help/hc/en-us/articles/360060590573-Download-all-your-data#downloadmail>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
   | Proton Mail    | MBOX/EML                                       | <https://proton.me/support/export-emails-import-export-app>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
   | Tutanota       | EML                                            | <https://github.com/crepererum-oss/tatutanatata>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | Gandi          | EML                                            | <https://docs.gandi.net/en/gandimail/common_operations/backup_email.html#contents>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
   | Zoho           | EML                                            | <https://www.zoho.com/mail/help/import-export-emails.html#alink2>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
   | Altro          | [Usa Thunderbird](https://www.thunderbird.net) | Configura il tuo account email esistente in Thunderbird e poi usa il plugin [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/) per esportare e importare la tua email.  **Potresti anche essere in grado di copiare/incollare o trascinare/rilasciare le email da un account all'altro.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
2. Scarica, installa e apri [Thunderbird](https://www.thunderbird.net).

3. Crea un nuovo account utilizzando l'indirizzo email completo del tuo alias (es. <code><you@yourdomain.com></code>) e la password generata.  <strong>Se non hai ancora una password generata, allora <a href="/faq#do-you-support-receiving-email-with-imap" target="_blank">consulta le nostre istruzioni di configurazione</a></strong>.

4. Scarica e installa il plugin Thunderbird [ImportExportTools NG](https://addons.thunderbird.net/en-GB/thunderbird/addon/importexporttools-ng/).

5. Crea una nuova cartella locale in Thunderbird, quindi clicca con il tasto destro su di essa → seleziona l'opzione `ImportExportTools NG` → scegli `Importa file mbox` (per il formato di esportazione MBOX) – oppure – `Importa messaggi` / `Importa tutti i messaggi da una directory` (per il formato di esportazione EML).

6. Trascina/rilascia dalla cartella locale a una nuova cartella IMAP (o esistente) in Thunderbird in cui desideri caricare i messaggi nello storage IMAP con il nostro servizio.  Questo garantirà che siano salvati online con il nostro storage crittografato SQLite.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Suggerimento:
     </strong>
     <span>
       Se non sei sicuro su come importare in Thunderbird, puoi fare riferimento alle istruzioni ufficiali su <a class="alert-link" href="https://kb.mozillazine.org/Importing_folders">https://kb.mozillazine.org/Importing_folders</a> e <a class="alert-link" href="https://github.com/thunderbird/import-export-tools-ng/wiki">https://github.com/thunderbird/import-export-tools-ng/wiki</a>.
     </span>
   </div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Una volta completato il processo di esportazione e importazione, potresti anche voler abilitare l'inoltro sul tuo account email esistente e configurare una risposta automatica per notificare ai mittenti che hai un nuovo indirizzo email (ad esempio, se prima usavi Gmail e ora stai usando un'email con il tuo dominio personalizzato).
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

### Come posso usare il mio storage compatibile S3 per i backup {#how-do-i-use-my-own-s3-compatible-storage-for-backups}

Gli utenti con piano a pagamento possono configurare un proprio provider di storage compatibile con [S3](https://en.wikipedia.org/wiki/Amazon_S3) su base per dominio per i backup IMAP/SQLite.  Questo significa che i backup crittografati della tua casella possono essere archiviati sulla tua infrastruttura invece che (o in aggiunta a) il nostro storage predefinito.

I provider supportati includono [Amazon S3](https://aws.amazon.com/s3/), [Cloudflare R2](https://developers.cloudflare.com/r2/), [MinIO](https://github.com/minio/minio), [Backblaze B2](https://www.backblaze.com/cloud-storage), [DigitalOcean Spaces](https://www.digitalocean.com/products/spaces) e qualsiasi altro servizio compatibile S3.

#### Configurazione {#setup}

1. Crea un bucket **privato** con il tuo provider compatibile S3.  Il bucket non deve essere accessibile pubblicamente.
2. Crea le credenziali di accesso (access key ID e secret access key) con permessi di lettura/scrittura sul bucket.
3. Vai su <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Il Mio Account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Impostazioni Avanzate <i class="fa fa-angle-right"></i> Storage Personalizzato Compatibile S3.
4. Seleziona **"Abilita storage personalizzato compatibile S3"** e inserisci l'URL endpoint, access key ID, secret access key, regione e nome del bucket.
5. Clicca su **"Test Connessione"** per verificare le credenziali, l'accesso al bucket e i permessi di scrittura.
6. Clicca su **"Salva"** per applicare le impostazioni.

#### Come funzionano i backup {#how-backups-work}

I backup vengono attivati automaticamente per ogni alias IMAP connesso.  Il server IMAP controlla tutte le connessioni attive una volta all'ora e avvia un backup per ogni alias connesso.  Un blocco basato su Redis impedisce che vengano eseguiti backup duplicati entro 30 minuti l'uno dall'altro, e il backup effettivo viene saltato se un backup riuscito è già stato completato nelle ultime 24 ore (a meno che il backup non sia stato esplicitamente richiesto da un utente per il download).
I backup possono anche essere avviati manualmente cliccando su **"Download Backup"** per qualsiasi alias nella dashboard. I backup manuali vengono sempre eseguiti indipendentemente dalla finestra di 24 ore.

Il processo di backup funziona come segue:

1. Il database SQLite viene copiato utilizzando `VACUUM INTO`, che crea uno snapshot coerente senza interrompere le connessioni attive e preserva la crittografia del database.
2. Il file di backup viene verificato aprendolo per confermare che la crittografia sia ancora valida.
3. Viene calcolato un hash SHA-256 e confrontato con il backup esistente nello storage. Se l'hash corrisponde, il caricamento viene saltato (nessuna modifica dall'ultimo backup).
4. Il backup viene caricato su S3 utilizzando il caricamento multipart tramite la libreria [@aws-sdk/lib-storage](https://github.com/aws/aws-sdk-js-v3/tree/main/lib/lib-storage).
5. Viene generato un URL di download firmato (valido per 4 ore) e inviato via email all'utente.

#### Formati di Backup {#backup-formats}

Sono supportati tre formati di backup:

| Formato  | Estensione | Descrizione                                                                 |
| -------- | ---------- | --------------------------------------------------------------------------- |
| `sqlite` | `.sqlite`  | Snapshot grezzo del database SQLite crittografato (predefinito per backup IMAP automatici) |
| `mbox`   | `.zip`     | ZIP protetto da password contenente la mailbox in formato mbox              |
| `eml`    | `.zip`     | ZIP protetto da password contenente singoli file `.eml` per ogni messaggio  |

> **Suggerimento:** Se hai file di backup `.sqlite` e vuoi convertirli in file `.eml` localmente, usa il nostro strumento CLI standalone **[convert-sqlite-to-eml](#how-do-i-convert-sqlite-backups-to-eml-files)**. Funziona su Windows, Linux e macOS e non richiede una connessione di rete.

#### Nomenclatura dei File e Struttura delle Chiavi {#file-naming-and-key-structure}

Quando si utilizza uno **storage S3 personalizzato**, i file di backup vengono memorizzati con un prefisso timestamp in formato [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) in modo che ogni backup sia conservato come oggetto separato. Questo ti offre una cronologia completa dei backup nel tuo bucket.

Il formato della chiave è:

```
{timestamp ISO 8601}-{alias_id}.{estensione}
```

Ad esempio:

```
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
2025-03-01T12:00:00.000Z-65a31c53c36b75ed685f3fda.zip
2025-03-02T12:00:00.000Z-65a31c53c36b75ed685f3fda.sqlite
```

L'`alias_id` è l'ObjectId MongoDB dell'alias. Puoi trovarlo nella pagina delle impostazioni dell'alias o tramite l'API.

Quando si utilizza lo **storage predefinito (di sistema)**, la chiave è piatta (es. `65a31c53c36b75ed685f3fda.sqlite`) e ogni backup sovrascrive il precedente.

> **Nota:** Poiché lo storage S3 personalizzato conserva tutte le versioni di backup, l'utilizzo dello spazio crescerà nel tempo. Raccomandiamo di configurare le [regole di lifecycle](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html) sul tuo bucket per eliminare automaticamente i backup vecchi (es. cancellare oggetti più vecchi di 30 o 90 giorni).

#### Proprietà dei Dati e Politica di Cancellazione {#data-ownership-and-deletion-policy}

Il tuo bucket S3 personalizzato è interamente sotto il tuo controllo. Noi **non cancelliamo né modifichiamo** mai i file nel tuo bucket S3 personalizzato — né quando un alias viene eliminato, né quando un dominio viene rimosso, né durante operazioni di pulizia. Scriviamo solo nuovi file di backup nel tuo bucket.

Questo significa:

* **Eliminazione alias** — Quando elimini un alias, rimuoviamo il backup solo dal nostro storage di sistema predefinito. Qualsiasi backup precedentemente scritto nel tuo bucket S3 personalizzato rimane intatto.
* **Rimozione dominio** — Rimuovere un dominio non influisce sui file nel tuo bucket personalizzato.
* **Gestione della conservazione** — Sei responsabile della gestione dello storage nel tuo bucket, inclusa la configurazione delle regole di lifecycle per eliminare i backup vecchi.

Se disabiliti lo storage S3 personalizzato o torni al nostro storage predefinito, i file esistenti nel tuo bucket vengono preservati. I backup futuri saranno semplicemente scritti nel nostro storage predefinito.

#### Sicurezza {#security}

* Il tuo access key ID e secret access key sono **crittografati a riposo** usando [AES-256-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode) prima di essere memorizzati nel nostro database. Vengono decrittografati solo in fase di esecuzione durante le operazioni di backup.
* Validiamo automaticamente che il tuo bucket **non sia accessibile pubblicamente**. Se viene rilevato un bucket pubblico, la configurazione verrà rifiutata al salvataggio. Se l'accesso pubblico viene rilevato al momento del backup, si torna al nostro storage predefinito e tutti gli amministratori di dominio vengono notificati via email.
* Le credenziali vengono validate al salvataggio tramite una chiamata [HeadBucket](https://docs.aws.amazon.com/AmazonS3/latest/API/API_HeadBucket.html) per assicurarsi che il bucket esista e che le credenziali siano corrette. Se la validazione fallisce, lo storage S3 personalizzato viene disabilitato automaticamente.
* Ogni file di backup include un hash SHA-256 nei suoi metadata S3, usato per rilevare database invariati e saltare caricamenti ridondanti.
#### Notifiche di errore {#error-notifications}

Se un backup fallisce durante l'uso del tuo storage S3 personalizzato (ad esempio a causa di credenziali scadute o di un problema di connettività), tutti gli amministratori del dominio saranno notificati via email. Queste notifiche sono limitate a una ogni 6 ore per evitare avvisi duplicati. Se il tuo bucket viene rilevato come accessibile pubblicamente al momento del backup, gli amministratori saranno notificati una volta al giorno.

#### API {#api}

Puoi anche configurare uno storage S3 personalizzato tramite l'API:

```sh
curl -X PUT https://api.forwardemail.net/v1/domains/example.com \
  -u API_TOKEN: \
  -d has_custom_s3=true \
  -d s3_endpoint=https://s3.us-east-1.amazonaws.com \
  -d s3_access_key_id=YOUR_ACCESS_KEY_ID \
  -d s3_secret_access_key=YOUR_SECRET_ACCESS_KEY \
  -d s3_region=us-east-1 \
  -d s3_bucket=my-email-backups
```

Per testare la connessione tramite l'API:

```sh
curl -X POST https://api.forwardemail.net/v1/domains/example.com/test-s3-connection \
  -u API_TOKEN:
```

### Come converto i backup SQLite in file EML {#how-do-i-convert-sqlite-backups-to-eml-files}

Se scarichi o memorizzi backup SQLite (sia dal nostro storage predefinito sia dal tuo [custom S3 bucket](#how-do-i-use-my-own-s3-compatible-storage-for-backups)), puoi convertirli in file standard `.eml` usando il nostro strumento CLI standalone **[convert-sqlite-to-eml](https://github.com/forwardemail/forwardemail.net/tree/master/tools/convert-sqlite-to-eml)**. I file EML possono essere aperti con qualsiasi client di posta ([Thunderbird](https://www.thunderbird.net/), [Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook), [Apple Mail](https://support.apple.com/mail), ecc.) oppure importati in altri server di posta.

#### Installazione {#installation-1}

Puoi scaricare un binario precompilato (non è richiesto [Node.js](https://github.com/nodejs/node)) oppure eseguirlo direttamente con [Node.js](https://github.com/nodejs/node):

**Binari precompilati** — Scarica l’ultima release per la tua piattaforma da [GitHub Releases](https://github.com/forwardemail/forwardemail.net/releases):

| Piattaforma | Architettura  | File                                 |
| ----------- | ------------- | ------------------------------------ |
| Linux       | x64           | `convert-sqlite-to-eml-linux-x64`    |
| Linux       | arm64         | `convert-sqlite-to-eml-linux-arm64`  |
| macOS       | Apple Silicon | `convert-sqlite-to-eml-darwin-arm64` |
| Windows     | x64           | `convert-sqlite-to-eml-win-x64.exe`  |

> **Utenti macOS:** Dopo il download, potrebbe essere necessario rimuovere l’attributo di quarantena prima di eseguire il binario:
>
> ```bash
> sudo xattr -rd com.apple.quarantine ./convert-sqlite-to-eml-darwin-arm64
> ```
>
> (Sostituisci `./convert-sqlite-to-eml-darwin-arm64` con il percorso effettivo del file scaricato.)

> **Utenti Linux:** Dopo il download, potrebbe essere necessario rendere eseguibile il binario:
>
> ```bash
> chmod +x ./convert-sqlite-to-eml-linux-x64
> ```
>
> (Sostituisci `./convert-sqlite-to-eml-linux-x64` con il percorso effettivo del file scaricato.)

**Dal sorgente** (richiede [Node.js](https://github.com/nodejs/node) >= 18):

```bash
cd tools/convert-sqlite-to-eml
npm install
node index.js
```

#### Uso {#usage}

Lo strumento supporta sia modalità interattiva che non interattiva.

**Modalità interattiva** — esegui senza argomenti e ti verrà chiesto di inserire tutti i dati:

```bash
./convert-sqlite-to-eml
```

```
  Forward Email - Converti backup SQLite in EML
  =============================================

  Percorso del file di backup SQLite: /path/to/backup.sqlite
  Password IMAP/alias: ********
  Percorso output ZIP [/path/to/backup-2025-03-01T12-00-00-000Z.zip]:
```

**Modalità non interattiva** — passa gli argomenti tramite flag da linea di comando per scripting e automazione:

```bash
./convert-sqlite-to-eml \
  --path /path/to/backup.sqlite \
  --password "your-imap-password" \
  --output /path/to/output.zip
```

| Flag                | Descrizione                                                                    |
| ------------------- | ------------------------------------------------------------------------------ |
| `--path <path>`     | Percorso del file di backup SQLite criptato                                   |
| `--password <pass>` | Password IMAP/alias per la decrittazione                                      |
| `--output <path>`   | Percorso di output per il file ZIP (default: generato automaticamente con timestamp ISO 8601) |
| `--help`            | Mostra il messaggio di aiuto                                                  |
#### Formato di Output {#output-format}

Lo strumento produce un archivio ZIP protetto da password (crittografato AES-256) contenente:

```
README.txt
INBOX/
  <message-id-1>.eml
  <message-id-2>.eml
Sent/
  <message-id-3>.eml
Drafts/
  <message-id-4>.eml
```

I file EML sono organizzati per cartella della casella di posta. La password dello ZIP è la stessa della tua password IMAP/alias. Ogni file `.eml` è un messaggio email standard [RFC 5322](https://datatracker.ietf.org/doc/html/rfc5322) con intestazioni complete, testo del corpo e allegati ricostruiti dal database SQLite.

#### Come Funziona {#how-it-works}

1. Apre il database SQLite crittografato usando la tua password IMAP/alias (supporta sia i cifrari [ChaCha20](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) che [AES-256-CBC](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)).
2. Legge la tabella Mailboxes per scoprire la struttura delle cartelle.
3. Per ogni messaggio, decodifica il mimeTree (memorizzato come JSON compresso con [Brotli](https://github.com/google/brotli)) dalla tabella Messages.
4. Ricostruisce l'intero EML attraversando l'albero MIME e recuperando i corpi degli allegati dalla tabella Attachments.
5. Impacchetta tutto in un archivio ZIP protetto da password usando [archiver-zip-encrypted](https://github.com/artem-silaev/archiver-zip-encrypted).

### Supportate l’auto-ospitazione? {#do-you-support-self-hosting}

Sì, da marzo 2025 supportiamo un’opzione auto-ospitata. Leggi il blog [qui](https://forwardemail.net/blog/docs/self-hosted-solution). Consulta la [guida per l’auto-ospitazione](https://forwardemail.net/self-hosted) per iniziare. E per chi è interessato a una versione più dettagliata passo-passo, vedi le nostre guide basate su [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) o [Debian](https://forwardemail.net/guides/selfhosted-on-debian).


## Configurazione Email {#email-configuration}

### Come inizio e configuro l’inoltro email {#how-do-i-get-started-and-set-up-email-forwarding}

<div class="alert my-3 bg-dark border-themed text-white d-inline-block">
  <i class="fa fa-stopwatch font-weight-bold"></i>
  <strong class="font-weight-bold">Tempo Stimato per la Configurazione:</strong>
  <span>Meno di 10 minuti</span>
</div>

<div class="alert my-3 alert-success">
  <i class="fa fa-bullhorn font-weight-bold"></i>
  <strong class="font-weight-bold">
    Per Iniziare:
  </strong>
  <span>
    Leggi attentamente e segui i passaggi da uno a otto elencati di seguito. Assicurati di sostituire l’indirizzo email <code>user@gmail.com</code> con l’indirizzo email a cui vuoi inoltrare le email (se non è già corretto). Analogamente, assicurati di sostituire <code>example.com</code> con il tuo nome di dominio personalizzato (se non è già corretto).
  </span>
</div>

<ol>
  <li class="mb-2 mb-md-3 mb-lg-5">Se hai già registrato il tuo nome di dominio da qualche parte, allora devi saltare completamente questo passaggio e andare al passo due! Altrimenti puoi <a href="/domain-registration" rel="noopener noreferrer">cliccare qui per registrare il tuo nome di dominio</a>.</li>
  <li class="mb-2 mb-md-3 mb-lg-5">
  Ricordi dove hai registrato il tuo dominio? Una volta che lo ricordi, segui le istruzioni qui sotto:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Devi aprire una nuova scheda e accedere al tuo registrar di domini. Puoi facilmente cliccare sul tuo "Registrar" qui sotto per farlo automaticamente. In questa nuova scheda, devi navigare alla pagina di gestione DNS presso il tuo registrar – e abbiamo fornito i passaggi dettagliati sotto la colonna "Passaggi per Configurare". Una volta arrivato a questa pagina nella nuova scheda, puoi tornare a questa scheda e procedere al passo tre qui sotto.
    <strong class="font-weight-bold">Non chiudere ancora la scheda aperta; ti servirà per i passaggi futuri!</strong>
  </span>
</div>

<table id="table-dns-management-by-registrar" class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Registrar</th>
      <th>Passaggi per Configurare</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://login.ionos.com/">1&amp;1</a></td>
      <td>Accedi <i class="fa fa-angle-right"></i> Centro Domini <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio) <i class="fa fa-angle-right"></i> Modifica Impostazioni DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://console.aws.amazon.com/route53/">Amazon Route 53</a></td>
      <td>Accedi <i class="fa fa-angle-right"></i> Hosted Zones <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.aplus.net/">Aplus.net</a></td>
      <td>Accedi <i class="fa fa-angle-right"></i> I miei Server <i class="fa fa-angle-right"></i> Gestione Domini <i class="fa fa-angle-right"></i> Gestore DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries">Bluehost</a></td>
      <td>PER ROCK: Accedi <i class="fa fa-angle-right"></i> Domini <i class="fa fa-angle-right"></i> (Clicca l’icona ▼ accanto a gestisci) <i class="fa fa-angle-right"></i> DNS
      <br />
      PER LEGACY: Accedi <i class="fa fa-angle-right"></i> Domini <i class="fa fa-angle-right"></i> Editor zona <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dash.cloudflare.com/login">Cloudflare</a></td>
      <td>Accedi <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cp.dnsmadeeasy.com/">DNS Made Easy</a></td>
      <td>Accedi <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio)</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://dnsimple.com/dashboard">DNSimple</a></td>
      <td>Accedi <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio)  <i class="fa fa-angle-right"></i> DNS <i class="fa fa-angle-right"></i> Gestisci</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://cloud.digitalocean.com/login">Digital Ocean</a></td>
      <td>Accedi <i class="fa fa-angle-right"></i> Networking <i class="fa fa-angle-right"></i> Domini <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio) <i class="fa fa-angle-right"></i> Altro <i class="fa fa-angle-right"></i> Gestisci Dominio</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.domain.com/help/article/dns-management-how-to-update-dns-records">Domain.com</a></td>
      <td>Accedi <i class="fa fa-angle-right"></i> In vista scheda, clicca gestisci sul tuo dominio <i class="fa fa-angle-right"></i> In vista elenco, clicca
l’icona ingranaggio <i class="fa fa-angle-right"></i> DNS & Nameservers <i class="fa fa-angle-right"></i> Record DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.domains.com/">Domains.com</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=WnU0Gp-Y-es"><i class="fa fa-play-circle"></i> Guarda</a>
      </td>
      <td>Accedi <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio) <i class="fa fa-angle-right"></i> Gestisci <i class="fa fa-angle-right"></i> (clicca icona ingranaggio) <i class="fa fa-angle-right"></i> Clicca su DNS &amp; Nameservers nel menu a sinistra</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://panel.dreamhost.com/">DreamHost</a></td>
      <td>Accedi <i class="fa fa-angle-right"></i> Pannello <i class="fa fa-angle-right"></i> Domini <i class="fa fa-angle-right"></i> Gestisci Domini <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://portal.dynect.net/login/">Dyn</a></td>
      <td>Accedi <i class="fa fa-angle-right"></i> Panoramica <i class="fa fa-angle-right"></i> Gestisci <i class="fa fa-angle-right"></i> Editor Semplice <i class="fa fa-angle-right"></i> Record</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://id.gandi.net/en/login">Gandi</a></td>
      <td>Accedi <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio) <i class="fa fa-angle-right"></i> Gestione <i class="fa fa-angle-right"></i> Modifica la zona</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://sso.godaddy.com">GoDaddy</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G7g8FiZL5D8"><i class="fa fa-play-circle"></i> Guarda</a>
      </td>
      <td>Accedi <i class="fa fa-angle-right"></i> Gestisci i miei domini <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio) <i class="fa fa-angle-right"></i> Gestisci DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://domains.google.com/registrar">Google Domains</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=01iHjbIN5CQ"><i class="fa fa-play-circle"></i> Guarda</a>
      </td>
      <td>Accedi <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio) <i class="fa fa-angle-right"></i> Configura DNS</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://www.namecheap.com/myaccount/login/">Namecheap</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=no62GCzMn7E"><i class="fa fa-play-circle"></i> Guarda</a>
      </td>
      <td>Accedi <i class="fa fa-angle-right"></i> Lista Domini <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio) <i class="fa fa-angle-right"></i> Gestisci <i class="fa fa-angle-right"></i> DNS Avanzato</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://app.netlify.com/">Netlify</a></td>
      <td>Accedi <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio) <i class="fa fa-angle-right"></i> Configura Netlify DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.networksolutions.com/manage-it/index.jsp">Network Solutions</a></td>
      <td>Accedi <i class="fa fa-angle-right"></i> Gestore Account <i class="fa fa-angle-right"></i> I miei nomi di dominio <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio) <i class="fa fa-angle-right"></i> Gestisci <i class="fa fa-angle-right"></i> Cambia dove punta il dominio <i class="fa fa-angle-right"></i> DNS Avanzato</td>
    </tr>
    <tr>
      <td>
        <a rel="noopener noreferrer" target="_blank" href="https://accounts.shopify.com/store-login">Shopify</a>
        <br />
        <a class="btn btn-dark" rel="noopener noreferrer" target="_blank" href="https://www.youtube.com/watch?v=G1NR8CIdv2M"><i class="fa fa-play-circle"></i> Guarda</a>
      </td>
      <td>Accedi <i class="fa fa-angle-right"></i> Domini Gestiti <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio) <i class="fa fa-angle-right"></i> Impostazioni DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.squarespace.com/hc/en-us/articles/214767107">Squarespace</a></td>
      <td>Accedi <i class="fa fa-angle-right"></i> Menu Home <i class="fa fa-angle-right"></i> Impostazioni <i class="fa fa-angle-right"></i> Domini <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio) <i class="fa fa-angle-right"></i>
Impostazioni avanzate <i class="fa fa-angle-right"></i> Record personalizzati</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://vercel.com/docs/now-cli?utm_source=zeit-dashboard&utm_medium=web&utm_campaign=configure-dns#commands/dns">Now di Vercel</a></td>
      <td>Usando la CLI "now" <i class="fa fa-angle-right"></i> <code>now dns add [domain] '@' MX [record-value] [priority]</code></td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.weebly.com/app/help/us/en/topics/manage-dns-records">Weebly</a></td>
      <td>Accedi <i class="fa fa-angle-right"></i> Pagina Domini <i class="fa fa-angle-right"></i> (Seleziona il tuo dominio) <i class="fa fa-angle-right"></i> DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://support.wix.com/en/article/adding-dns-records-in-your-wix-account">Wix</a></td>
      <td>Accedi <i class="fa fa-angle-right"></i> Pagina Domini <i class="fa fa-angle-right"></i> (Clicca l’icona <i class="fa fa-ellipsis-h"></i>) <i class="fa fa-angle-right"></i> Seleziona Gestisci Record DNS</td>
    </tr>
    <tr>
      <td><a rel="noopener noreferrer" target="_blank" href="https://www.enom.com/login.aspx?page=%2fmyaccount%2fdefault.aspx&amp;">eNom</a></td>
      <td>Accedi <i class="fa fa-angle-right"></i> Domini <i class="fa fa-angle-right"></i> I miei domini</td>
    </tr>
    <tr>
      <td>Altro</td>
      <td>
        <div class="alert mb-0 alert-warning"><i class="fa fa-exclamation-circle font-weight-bold"></i> <strong class="font-weight-bold">Importante:</strong> Non vedi il nome del tuo registrar elencato qui? Cerca semplicemente su Internet "come cambiare i record DNS su $REGISTRAR" (sostituendo $REGISTRAR con il nome del tuo registrar – es. "come cambiare i record DNS su GoDaddy" se usi GoDaddy).</div>
      </td>
    </tr>
  </tbody>
</table>
</li>
<li class="mb-2 mb-md-3 mb-lg-5">Usando la pagina di gestione DNS del tuo registrar (l’altra scheda che hai aperto), imposta i seguenti record "MX":
<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Nota che NON devono essere impostati altri record MX. Entrambi i record mostrati di seguito DEVONO esistere. Assicurati che non ci siano errori di battitura; e che entrambi mx1 e mx2 siano scritti correttamente. Se esistevano già record MX, si prega di eliminarli completamente.
    Il valore "TTL" non deve necessariamente essere 3600, può essere un valore più basso o più alto se necessario.
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Priority</th>
      <th>Answer/Value</th>
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

</li><li class="mb-2 mb-md-3 mb-lg-5" id="dns-configuration-options">Usando la pagina di gestione DNS del tuo registrar (l’altra scheda che hai aperto), imposta il seguente/i record <strong class="notranslate">TXT</strong>:

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Se sei su un piano a pagamento, devi saltare completamente questo passaggio e andare al passo cinque! Se non sei su un piano a pagamento, allora i tuoi indirizzi inoltrati saranno pubblicamente ricercabili – vai su <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Il Mio Account <i class="fa fa-angle-right"></i> Domini</a> e aggiorna il tuo dominio a un piano a pagamento se desideri. Se vuoi saperne di più sui piani a pagamento, consulta la nostra pagina <a rel="noopener noreferrer" href="/private-business-email" class="alert-link">Prezzi</a>. Altrimenti puoi continuare a scegliere una o più combinazioni dall’Opzione A all’Opzione F elencate di seguito.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Opzione A:
  </strong>
  <span>
    Se stai inoltrando tutte le email dal tuo dominio, (es. "all@example.com", "hello@example.com", ecc.) a un indirizzo specifico "user@gmail.com":
  </span>
</div>

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Name/Host/Alias</th>
      <th class="text-center">TTL</th>
      <th>Type</th>
      <th>Answer/Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><em>"@", ".", o vuoto</em></td>
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
    Assicurati di sostituire i valori sopra nella colonna "Valore" con il tuo indirizzo email. Il valore "TTL" non deve necessariamente essere 3600, può essere un valore più basso o più alto se necessario. Un valore di tempo di vita ("TTL") più basso garantirà che eventuali modifiche future ai tuoi record DNS vengano propagate più rapidamente su Internet – pensa a questo come a quanto tempo sarà memorizzato nella cache in memoria (in secondi). Puoi saperne di più su <a href="https://en.wikipedia.org/wiki/Time_to_live#DNS_records" rel="noopener noreferrer" target="_blank" class="alert-link">TTL su Wikipedia</a>.
  </span>
</div>

---

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Opzione B:
  </strong>
  <span>
    Se devi solo inoltrare un singolo indirizzo email (es. <code>hello@example.com</code> a <code>user@gmail.com</code>; questo inoltrerà automaticamente anche "hello+test@example.com" a "user+test@gmail.com"):
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
    Se stai inoltrando più email, allora dovrai separarle con una virgola:
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
    Puoi configurare un numero infinito di email di inoltro – assicurati solo di non superare i 255 caratteri in una singola riga e di iniziare ogni riga con "forward-email=". Un esempio è fornito qui sotto:
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
      <td><em>"@", ".", o vuoto</em></td>
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
    Puoi anche specificare un nome di dominio nel tuo record <strong class="notranslate">TXT</strong> per avere un inoltro alias globale (es. "user@example.com" sarà inoltrato a "user@example.net"):
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
    Puoi anche usare i webhook come alias globale o individuale per inoltrare le email. Vedi l'esempio e la sezione completa sui webhook intitolata <a href="#do-you-support-webhooks" class="alert-link">Supportate i webhook</a> qui sotto.
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
    Puoi anche usare espressioni regolari ("regex") per abbinare alias e per gestire sostituzioni a cui inoltrare le email. Vedi gli esempi e la sezione completa sulle regex intitolata <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Supportate espressioni regolari o regex</a> qui sotto.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Hai bisogno di regex avanzate con sostituzione?</strong> Vedi gli esempi e la sezione completa sulle regex intitolata <a href="#do-you-support-regular-expressions-or-regex" class="alert-link">Supportate espressioni regolari o regex</a> qui sotto.
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Esempio semplice:</strong> Se voglio che tutte le email inviate a `linus@example.com` o `torvalds@example.com` vengano inoltrate a `user@gmail.com`:
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
    Le regole di inoltro catch-all possono anche essere descritte come "fall-through".
    Questo significa che le email in arrivo che corrispondono ad almeno una regola di inoltro specifica verranno usate invece del catch-all.
    Le regole specifiche includono indirizzi email ed espressioni regolari.
    <br /><br />
    Per esempio:
    <br />
    <code>forward-email=hello:first@gmail.com,second@gmail.com</code>
    <br />
    Le email inviate a <code>hello@example.com</code> **non** saranno inoltrate a <code>second@gmail.com</code> (catch-all) con questa configurazione, ma saranno consegnate solo a <code>first@gmail.com</code>.
  </span>
</div>

---

</li><li class="mb-2 mb-md-3 mb-lg-5">Usando la pagina di gestione DNS del tuo registrar (l'altra scheda che hai aperto), imposta inoltre il seguente record <strong class="notranslate">TXT</strong>:

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
    Se usi Gmail (ad esempio Invia come) o G Suite, dovrai aggiungere <code>include:_spf.google.com</code> al valore sopra, per esempio:
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
    Se hai già una riga simile con "v=spf1", dovrai aggiungere <code>include:spf.forwardemail.net</code> subito prima di qualsiasi record "include:host.com" esistente e prima di "-all" nella stessa riga, per esempio:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Nota che c'è una differenza tra "-all" e "~all". Il "-" indica che il controllo SPF deve FALLIRE se non corrisponde, mentre "~" indica che il controllo SPF deve SOFTFAIL. Raccomandiamo di usare l'approccio "-all" per prevenire la falsificazione del dominio.
    <br /><br />
    Potresti anche dover includere il record SPF per qualunque host da cui invii mail (ad esempio Outlook).
  </span>
</div>
</li><li class="mb-2 mb-md-3 mb-lg-5">Verifica i tuoi record DNS utilizzando il nostro strumento "Verifica Record" disponibile su <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Il Mio Account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Configurazione.

</li><li class="mb-2 mb-md-3 mb-lg-5">Invia un'email di prova per confermare che funzioni. Nota che potrebbe richiedere del tempo perché i tuoi record DNS si propaghino.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Suggerimento:
  </strong>
  <span>
  </span>
    Se non ricevi le email di prova, o ricevi un'email di prova che dice "Fai attenzione a questo messaggio", consulta le risposte per <a href="#why-am-i-not-receiving-my-test-emails" class="alert-link">Perché non ricevo le mie email di prova</a> e <a href="#why-are-my-test-emails-sent-to-myself-in-gmail-showing-as-suspicious" class="alert-link">Perché le mie email di prova inviate a me stesso in Gmail appaiono come "sospette"</a> rispettivamente.
</div>

</li><li class="mb-2 mb-md-3 mb-lg-5">Se desideri "Inviare posta come" da Gmail, allora dovrai <strong><a href="https://www.youtube.com/watch?v=MEheS8gM4Xs" target="_blank" rel="noopener noreferrer">guardare questo video</a></strong>, oppure seguire i passaggi sotto <a href="#how-to-send-mail-as-using-gmail">Come inviare posta come usando Gmail</a> qui sotto.

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
    Gli add-on opzionali sono elencati di seguito. Nota che questi add-on sono completamente opzionali e potrebbero non essere necessari. Volevamo almeno fornirti informazioni aggiuntive se necessario.
  </span>
</div>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Add-on opzionale:
  </strong>
  <span>
    Se stai usando la funzione <a class="alert-link" href="#how-to-send-mail-as-using-gmail">Come inviare posta come usando Gmail</a>, potresti voler aggiungerti a una lista di permessi. Consulta <a class="alert-link" href="https://support.google.com/a/answer/60752?hl=en" target="_blank" rel="noopener noreferrer">queste istruzioni di Gmail</a> su questo argomento.
  </span>
</div>

### Posso usare più scambi MX e server per l'inoltro avanzato {#can-i-use-multiple-mx-exchanges-and-servers-for-advanced-forwarding}

Sì, ma **dovresti avere elencato un solo scambio MX nei tuoi record DNS**.

Non tentare di usare la "Priorità" come modo per configurare più scambi MX.

Invece, devi configurare il tuo scambio MX esistente per inoltrare la posta per tutti gli alias non corrispondenti agli scambi del nostro servizio (`mx1.forwardemail.net` e/o `mx2.forwardemail.net`).

Se usi Google Workspace e vuoi inoltrare tutti gli alias non corrispondenti al nostro servizio, consulta <https://support.google.com/a/answer/6297084>.

Se usi Microsoft 365 (Outlook) e vuoi inoltrare tutti gli alias non corrispondenti al nostro servizio, consulta <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/use-connectors-to-configure-mail-flow/set-up-connectors-to-route-mail> e <https://learn.microsoft.com/en-us/exchange/mail-flow-best-practices/manage-mail-flow-for-multiple-locations>.

### Come configuro un risponditore automatico per le vacanze (risponditore automatico fuori sede) {#how-do-i-set-up-a-vacation-responder-out-of-office-auto-responder}

Vai su <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Il Mio Account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Alias e crea o modifica l'alias per cui desideri configurare un risponditore automatico per le vacanze.
Hai la possibilità di configurare una data di inizio, una data di fine, un oggetto e un messaggio, e abilitarlo o disabilitarlo in qualsiasi momento:

* Attualmente sono supportati oggetto e messaggio in testo semplice (internamente utilizziamo il pacchetto `striptags` per rimuovere qualsiasi HTML).
* L'oggetto è limitato a 100 caratteri.
* Il messaggio è limitato a 1000 caratteri.
* La configurazione richiede la configurazione SMTP in uscita (ad esempio, dovrai configurare i record DNS DKIM, DMARC e Return-Path).
  * Vai su <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Impostazioni <i class="fa fa-angle-right"></i> Configurazione SMTP in uscita e segui le istruzioni di configurazione.
* Il risponditore automatico per le vacanze non può essere abilitato sui nomi di dominio vanity globali (ad esempio, non sono supportati gli [indirizzi usa e getta](/disposable-addresses)).
* Il risponditore automatico per le vacanze non può essere abilitato per alias con caratteri jolly/catch-all (`*`) né espressioni regolari.

A differenza di sistemi di posta come `postfix` (ad esempio che usano l'estensione filtro vacation `sieve`), Forward Email aggiunge automaticamente la tua firma DKIM, protegge da problemi di connessione durante l'invio delle risposte automatiche (ad esempio a causa di comuni problemi di connessione SSL/TLS e server legacy mantenuti), e supporta anche Open WKD e crittografia PGP per le risposte automatiche.

<!--
* Per prevenire abusi, verrà detratto 1 credito SMTP in uscita per ogni messaggio del risponditore automatico inviato.
  * Tutti gli account a pagamento includono 300 crediti al giorno di default. Se hai bisogno di una quantità maggiore, contattaci.
-->

1. Inviamo solo una volta ogni 4 giorni per ogni mittente [in lista bianca](#do-you-have-an-allowlist) (comportamento simile a Gmail).

   * La nostra cache Redis utilizza un'impronta digitale di `alias_id` e `sender`, dove `alias_id` è l'ID MongoDB dell'alias e `sender` è l'indirizzo From (se in lista bianca) oppure il dominio principale nell'indirizzo From (se non in lista bianca). Per semplicità, la scadenza di questa impronta nella cache è impostata a 4 giorni.

   * Il nostro approccio di usare il dominio principale estratto dall'indirizzo From per mittenti non in lista bianca previene abusi da parte di mittenti relativamente sconosciuti (ad esempio attori malevoli) che potrebbero inondare di messaggi il risponditore automatico.

2. Inviamo solo se MAIL FROM e/o From non sono vuoti e non contengono (case-insensitive) un [nome utente postmaster](#what-are-postmaster-addresses) (la parte prima della @ in un'email).

3. Non inviamo se il messaggio originale aveva uno dei seguenti header (case-insensitive):

   * Header `auto-submitted` con valore diverso da `no`.
   * Header `x-auto-response-suppress` con valore `dr`, `autoreply`, `auto-reply`, `auto_reply` o `all`.
   * Header `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` o `x-auto-respond` (indipendentemente dal valore).
   * Header `precedence` con valore `bulk`, `autoreply`, `auto-reply`, `auto_reply` o `list`.

4. Non inviamo se l'indirizzo email MAIL FROM o From termina con `+donotreply`, `-donotreply`, `+noreply` o `-noreply`.

5. Non inviamo se la parte username dell'indirizzo email From era `mdaemon` e aveva un header case-insensitive `X-MDDSN-Message`.

6. Non inviamo se era presente un header case-insensitive `content-type` con valore `multipart/report`.

### Come configuro SPF per Forward Email {#how-do-i-set-up-spf-for-forward-email}

Usando la pagina di gestione DNS del tuo registrar, imposta il seguente record <strong class="notranslate">TXT</strong>:

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
    Se usi Gmail (ad esempio Invia come) o G Suite, dovrai aggiungere <code>include:_spf.google.com</code> al valore sopra, per esempio:
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
    Se stai usando Microsoft Outlook o Live.com, dovrai aggiungere <code>include:spf.protection.outlook.com</code> al tuo record SPF <strong class="notranslate">TXT</strong>, per esempio:
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
    Se hai già una riga simile con "v=spf1", allora dovrai aggiungere <code>include:spf.forwardemail.net</code> subito prima di qualsiasi record "include:host.com" esistente e prima di "-all" nella stessa riga, per esempio:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:host.com -all</code>
    <br /><br />
    Nota che c'è una differenza tra "-all" e "~all". Il "-" indica che il controllo SPF deve FALLIRE se non corrisponde, mentre "~" indica che il controllo SPF deve SOFTFAIL. Raccomandiamo di usare l'approccio "-all" per prevenire la falsificazione del dominio.
    <br /><br />
    Potresti anche dover includere il record SPF per qualunque host da cui stai inviando mail (es. Outlook).
  </span>
</div>

### Come configuro DKIM per Forward Email {#how-do-i-set-up-dkim-for-forward-email}

Vai su <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Impostazioni <i class="fa fa-angle-right"></i> Configurazione SMTP in uscita e segui le istruzioni di configurazione.

### Come configuro DMARC per Forward Email {#how-do-i-set-up-dmarc-for-forward-email}

Vai su <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Impostazioni <i class="fa fa-angle-right"></i> Configurazione SMTP in uscita e segui le istruzioni di configurazione.

### Come visualizzo i rapporti DMARC {#how-do-i-view-dmarc-reports}

Forward Email fornisce una dashboard completa per i rapporti DMARC che ti permette di monitorare le prestazioni di autenticazione email su tutti i tuoi domini da un'unica interfaccia.

**Cosa sono i rapporti DMARC?**

I rapporti DMARC (Domain-based Message Authentication, Reporting, and Conformance) sono file XML inviati dai server di posta riceventi che ti indicano come le tue email vengono autenticate. Questi rapporti ti aiutano a capire:

* Quante email vengono inviate dal tuo dominio
* Se quelle email superano l'autenticazione SPF e DKIM
* Quali azioni i server riceventi stanno prendendo (accettare, mettere in quarantena o rifiutare)
* Quali indirizzi IP stanno inviando email per conto del tuo dominio

**Come accedere ai rapporti DMARC**

Vai su <a href="/my-account/dmarc-reports" class="alert-link" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Rapporti DMARC</a> per visualizzare la tua dashboard. Puoi anche accedere ai rapporti specifici per dominio da <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a> cliccando il pulsante "DMARC" accanto a qualsiasi dominio.

**Funzionalità della dashboard**

La dashboard dei rapporti DMARC offre:

* **Metriche di sintesi**: Totale rapporti ricevuti, totale messaggi analizzati, tasso di allineamento SPF, tasso di allineamento DKIM e tasso complessivo di superamento
* **Grafico Messaggi nel tempo**: Trend visivo del volume email e dei tassi di autenticazione negli ultimi 30 giorni
* **Sintesi allineamento**: Grafico a ciambella che mostra la distribuzione dell'allineamento SPF vs DKIM
* **Disposizione messaggi**: Grafico a barre impilate che mostra come i server riceventi hanno gestito le tue email (accettate, messe in quarantena o rifiutate)
* **Tabella rapporti recenti**: Elenco dettagliato dei singoli rapporti DMARC con filtri e paginazione
* **Filtro per dominio**: Filtra i rapporti per dominio specifico quando gestisci più domini
**Perché è Importante**

Per le organizzazioni che gestiscono più domini (come aziende, organizzazioni non profit o agenzie), i report DMARC sono essenziali per:

* **Identificare mittenti non autorizzati**: Rilevare se qualcuno sta contraffacendo il tuo dominio
* **Migliorare la consegna**: Assicurarsi che le tue email legittime superino l'autenticazione
* **Monitorare l'infrastruttura email**: Tenere traccia di quali servizi e IP inviano per tuo conto
* **Conformità**: Mantenere visibilità sull'autenticazione email per audit di sicurezza

A differenza di altri servizi che richiedono strumenti separati per il monitoraggio DMARC, Forward Email include l'elaborazione e la visualizzazione dei report DMARC come parte del tuo account senza costi aggiuntivi.

**Requisiti**

* I report DMARC sono disponibili solo per i piani a pagamento
* Il tuo dominio deve avere DMARC configurato (vedi [Come configuro DMARC per Forward Email](#how-do-i-set-up-dmarc-for-forward-email))
* I report vengono raccolti automaticamente quando i server di posta riceventi li inviano all'indirizzo di report DMARC configurato

**Report Email Settimanali**

Gli utenti dei piani a pagamento ricevono automaticamente riepiloghi settimanali dei report DMARC via email. Queste email includono:

* Statistiche riepilogative per tutti i tuoi domini
* Tassi di allineamento SPF e DKIM
* Suddivisione della disposizione dei messaggi (accettati, in quarantena, rifiutati)
* Principali organizzazioni che inviano report (Google, Microsoft, Yahoo, ecc.)
* Indirizzi IP con problemi di allineamento che potrebbero richiedere attenzione
* Link diretti alla dashboard dei tuoi report DMARC

I report settimanali vengono inviati automaticamente e non possono essere disabilitati separatamente dalle altre notifiche email.

### Come connettere e configurare i miei contatti {#how-do-i-connect-and-configure-my-contacts}

**Per configurare i tuoi contatti, usa l'URL CardDAV:** `https://carddav.forwardemail.net` (o semplicemente `carddav.forwardemail.net` se il tuo client lo consente)

### Come connettere e configurare i miei calendari {#how-do-i-connect-and-configure-my-calendars}

**Per configurare il tuo calendario, usa l'URL CalDAV:** `https://caldav.forwardemail.net` (o semplicemente `caldav.forwardemail.net` se il tuo client lo consente)

<img width="612" height="520" src="/img/faq/calendar-setup.png" alt="Esempio di configurazione Forward Email Calendar CalDAV Thunderbird" />

### Come aggiungere altri calendari e gestire quelli esistenti {#how-do-i-add-more-calendars-and-manage-existing-calendars}

Se desideri aggiungere calendari aggiuntivi, aggiungi un nuovo URL calendario: `https://caldav.forwardemail.net/dav/principals/calendar-name` (**assicurati di sostituire `calendar-name` con il nome del calendario desiderato**)

Puoi modificare il nome e il colore di un calendario dopo la creazione – usa semplicemente la tua applicazione calendario preferita (es. Apple Mail o [Thunderbird](https://thunderbird.net)).

### Come connettere e configurare attività e promemoria {#how-do-i-connect-and-configure-tasks-and-reminders}

**Per configurare attività e promemoria, usa lo stesso URL CalDAV dei calendari:** `https://caldav.forwardemail.net` (o semplicemente `caldav.forwardemail.net` se il tuo client lo consente)

Attività e promemoria saranno automaticamente separati dagli eventi del calendario in una propria raccolta "Promemoria" o "Attività".

**Istruzioni di configurazione per piattaforma:**

**macOS/iOS:**

1. Aggiungi un nuovo account CalDAV in Preferenze di Sistema > Account Internet (o Impostazioni > Account su iOS)
2. Usa `caldav.forwardemail.net` come server
3. Inserisci il tuo alias Forward Email e la password generata
4. Dopo la configurazione, vedrai sia le raccolte "Calendario" che "Promemoria"
5. Usa l'app Promemoria per creare e gestire le attività

**Android con Tasks.org:**

1. Installa Tasks.org da Google Play Store o F-Droid
2. Vai su Impostazioni > Sincronizzazione > Aggiungi account > CalDAV
3. Inserisci server: `https://caldav.forwardemail.net`
4. Inserisci il tuo alias Forward Email e la password generata
5. Tasks.org scoprirà automaticamente i tuoi calendari attività

**Thunderbird:**

1. Installa il componente aggiuntivo Lightning se non è già installato
2. Crea un nuovo calendario di tipo "CalDAV"
3. Usa URL: `https://caldav.forwardemail.net`
4. Inserisci le credenziali Forward Email
5. Eventi e attività saranno disponibili nell'interfaccia calendario

### Perché non posso creare attività in Promemoria macOS {#why-cant-i-create-tasks-in-macos-reminders}
Se hai problemi a creare attività in Promemoria su macOS, prova questi passaggi per la risoluzione dei problemi:

1. **Controlla la configurazione dell'account**: Assicurati che il tuo account CalDAV sia configurato correttamente con `caldav.forwardemail.net`

2. **Verifica calendari separati**: Dovresti vedere sia "Calendario" che "Promemoria" nel tuo account. Se vedi solo "Calendario", il supporto per le attività potrebbe non essere ancora completamente attivato.

3. **Aggiorna l'account**: Prova a rimuovere e aggiungere nuovamente il tuo account CalDAV in Preferenze di Sistema > Account Internet

4. **Controlla la connettività al server**: Verifica di poter accedere a `https://caldav.forwardemail.net` nel tuo browser

5. **Verifica le credenziali**: Assicurati di utilizzare l'alias email corretto e la password generata (non la password del tuo account)

6. **Forza la sincronizzazione**: Nell'app Promemoria, prova a creare un'attività e poi aggiorna manualmente la sincronizzazione

**Problemi comuni:**

* **"Calendario Promemoria non trovato"**: Il server potrebbe aver bisogno di un momento per creare la raccolta Promemoria al primo accesso
* **Attività non sincronizzate**: Controlla che entrambi i dispositivi utilizzino le stesse credenziali dell'account CalDAV
* **Contenuto misto**: Assicurati che le attività vengano create nel calendario "Promemoria", non nel "Calendario" generale

### Come configurare Tasks.org su Android {#how-do-i-set-up-tasksorg-on-android}

Tasks.org è un popolare gestore di attività open-source che funziona perfettamente con il supporto CalDAV per attività di Forward Email.

**Installazione e configurazione:**

1. **Installa Tasks.org**:
   * Dal Google Play Store: [Tasks.org](https://play.google.com/store/apps/details?id=org.tasks)
   * Da F-Droid: [Tasks.org su F-Droid](https://f-droid.org/packages/org.tasks/)

2. **Configura la sincronizzazione CalDAV**:
   * Apri Tasks.org
   * Vai a ☰ Menu > Impostazioni > Sincronizzazione
   * Tocca "Aggiungi account"
   * Seleziona "CalDAV"

3. **Inserisci le impostazioni di Forward Email**:
   * **URL server**: `https://caldav.forwardemail.net`
   * **Nome utente**: Il tuo alias Forward Email (es. `tuo@tuodominio.com`)
   * **Password**: La password generata specifica per l'alias
   * Tocca "Aggiungi account"

4. **Scoperta account**:
   * Tasks.org scoprirà automaticamente i tuoi calendari di attività
   * Dovresti vedere apparire la tua raccolta "Promemoria"
   * Tocca "Iscriviti" per abilitare la sincronizzazione del calendario attività

5. **Test sincronizzazione**:
   * Crea un'attività di prova in Tasks.org
   * Verifica che appaia in altri client CalDAV (come Promemoria su macOS)
   * Controlla che le modifiche si sincronizzino in entrambe le direzioni

**Funzionalità disponibili:**

* ✅ Creazione e modifica attività
* ✅ Date di scadenza e promemoria
* ✅ Completamento e stato attività
* ✅ Livelli di priorità
* ✅ Sottoattività e gerarchia attività
* ✅ Tag e categorie
* ✅ Sincronizzazione bidirezionale con altri client CalDAV

**Risoluzione problemi:**

* Se non appare alcun calendario attività, prova ad aggiornare manualmente nelle impostazioni di Tasks.org
* Assicurati di avere almeno un'attività creata sul server (puoi crearne una prima in Promemoria su macOS)
* Controlla la connettività di rete verso `caldav.forwardemail.net`

### Come configurare SRS per Forward Email {#how-do-i-set-up-srs-for-forward-email}

Configuriamo automaticamente il [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") – non è necessario che tu lo faccia manualmente.

### Come configurare MTA-STS per Forward Email {#how-do-i-set-up-mta-sts-for-forward-email}

Consulta [la nostra sezione su MTA-STS](#do-you-support-mta-sts) per maggiori informazioni.

### Come aggiungere una foto profilo al mio indirizzo email {#how-do-i-add-a-profile-picture-to-my-email-address}

Se usi Gmail, segui questi passaggi:

1. Vai su <https://google.com> e esci da tutti gli account email
2. Clicca su "Accedi" e nel menu a tendina clicca su "altro account"
3. Seleziona "Usa un altro account"
4. Seleziona "Crea account"
5. Seleziona "Usa invece il mio indirizzo email attuale"
6. Inserisci il tuo indirizzo email del dominio personalizzato
7. Recupera l'email di verifica inviata al tuo indirizzo email
8. Inserisci il codice di verifica contenuto in questa email
9. Completa le informazioni del profilo per il tuo nuovo account Google
10. Accetta tutte le politiche sulla Privacy e i Termini di utilizzo
11. Vai su <https://google.com> e in alto a destra clicca sull'icona del profilo, poi clicca sul pulsante "cambia"
12. Carica una nuova foto o avatar per il tuo account
13. Le modifiche impiegheranno circa 1-2 ore per propagarsi, ma a volte possono essere molto rapide.
14. Invia una email di prova e la foto profilo dovrebbe apparire.
## Funzionalità Avanzate {#advanced-features}

### Supportate newsletter o mailing list per email di marketing {#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email}

Sì, puoi leggere di più su <https://forwardemail.net/guides/newsletter-with-listmonk>.

Si prega di notare che, per mantenere la reputazione IP e garantire la consegnabilità, Forward Email ha un processo di revisione manuale per dominio per l'**approvazione delle newsletter**. Invia un'email a <support@forwardemail.net> o apri una [richiesta di assistenza](https://forwardemail.net/help) per l'approvazione. Questo processo di solito richiede meno di 24 ore, con la maggior parte delle richieste evase entro 1-2 ore. Nel prossimo futuro puntiamo a rendere questo processo istantaneo con controlli antispam aggiuntivi e notifiche. Questo processo garantisce che le tue email raggiungano la casella di posta e che i tuoi messaggi non vengano contrassegnati come spam.

### Supportate l'invio di email tramite API {#do-you-support-sending-email-with-api}

Sì, da maggio 2023 supportiamo l'invio di email tramite API come componente aggiuntivo per tutti gli utenti a pagamento.

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Assicurati di aver letto i nostri <a href="/terms" class="alert-link" target="_blank">Termini</a>, la <a href="/privacy" class="alert-link" target="_blank">Privacy Policy</a> e i <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limiti SMTP in uscita</a> &ndash; il tuo utilizzo è considerato come accettazione e accordo.
  </span>
</div>

Consulta la nostra sezione su [Email](/email-api#outbound-emails) nella documentazione API per opzioni, esempi e ulteriori dettagli.

Per inviare email in uscita con la nostra API, devi utilizzare il tuo token API disponibile sotto [La Mia Sicurezza](/my-account/security).

### Supportate la ricezione di email tramite IMAP {#do-you-support-receiving-email-with-imap}

Sì, dal 16 ottobre 2023 supportiamo la ricezione di email tramite IMAP come componente aggiuntivo per tutti gli utenti a pagamento.  **Si prega di leggere il nostro articolo approfondito** su [come funziona la nostra funzione di archiviazione della casella di posta crittografata SQLite](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="imap-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Assicurati di aver letto i nostri <a href="/terms" class="alert-link" target="_blank">Termini</a> e la <a href="/privacy" class="alert-link" target="_blank">Privacy Policy</a> &ndash; il tuo utilizzo è considerato come accettazione e accordo.
  </span>
</div>

1. Crea un nuovo alias per il tuo dominio sotto <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Il Mio Account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Alias (es. <code><hello@example.com></code>)

2. Clicca su <strong class="text-success"><i class="fa fa-key"></i> Genera Password</strong> accanto al nuovo alias creato. Copia negli appunti e conserva in modo sicuro la password generata mostrata a schermo.

3. Usando la tua applicazione email preferita, aggiungi o configura un account con il tuo alias appena creato (es. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Suggerimento:
     </strong>
     <span>Consigliamo di usare <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> o <a href="/blog/open-source" class="alert-link" target="_blank">un'alternativa open-source e focalizzata sulla privacy</a>.</span>
   </div>

4. Quando richiesto, inserisci come nome server IMAP `imap.forwardemail.net`

5. Quando richiesto, inserisci come porta server IMAP `993` (SSL/TLS) – vedi [porte IMAP alternative](/faq#what-are-your-imap-server-configuration-settings) se necessario
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Suggerimento:
     </strong>
     <span>Se usi Thunderbird, assicurati che la "Sicurezza della connessione" sia impostata su "SSL/TLS" e il metodo di autenticazione su "Password normale".</span>
   </div>
6. Quando ti viene chiesta la password del server IMAP, incolla la password da <strong class="text-success"><i class="fa fa-key"></i> Genera Password</strong> al punto 2 sopra

7. **Salva le tue impostazioni** – se riscontri problemi, per favore <a href="/help">contattaci</a>

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

### Supportate POP3 {#do-you-support-pop3}

Sì, dal 4 dicembre 2023 supportiamo [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) come componente aggiuntivo per tutti gli utenti a pagamento.  **Per favore leggi il nostro articolo approfondito** su [come funziona la nostra funzione di archiviazione della casella di posta crittografata SQLite](/blog/docs/best-quantum-safe-encrypted-email-service).

<div id="pop3-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Assicurati di aver letto i nostri <a href="/terms" class="alert-link" target="_blank">Termini</a> e la <a href="/privacy" class="alert-link" target="_blank">Informativa sulla Privacy</a> &ndash; il tuo utilizzo è considerato come riconoscimento e accettazione.
  </span>
</div>

1. Crea un nuovo alias per il tuo dominio sotto <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Il Mio Account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Alias (es. <code><hello@example.com></code>)

2. Clicca su <strong class="text-success"><i class="fa fa-key"></i> Genera Password</strong> accanto al nuovo alias creato. Copia negli appunti e conserva in modo sicuro la password generata mostrata a schermo.

3. Usando la tua applicazione email preferita, aggiungi o configura un account con il tuo nuovo alias (es. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Suggerimento:
     </strong>
     <span>Consigliamo di usare <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a>, o <a href="/blog/open-source" class="alert-link" target="_blank">un'alternativa open-source e focalizzata sulla privacy</a>.</span>
   </div>

4. Quando ti viene chiesto il nome del server POP3, inserisci `pop3.forwardemail.net`

5. Quando ti viene chiesto la porta del server POP3, inserisci `995` (SSL/TLS) – vedi [porte POP3 alternative](/faq#what-are-your-pop3-server-configuration-settings) se necessario
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Suggerimento:
     </strong>
     <span>Se usi Thunderbird, assicurati che "Sicurezza della connessione" sia impostata su "SSL/TLS" e il metodo di autenticazione su "Password normale".</span>
   </div>

6. Quando ti viene chiesta la password del server POP3, incolla la password da <strong class="text-success"><i class="fa fa-key"></i> Genera Password</strong> al punto 2 sopra

7. **Salva le tue impostazioni** – se riscontri problemi, per favore <a href="/help">contattaci</a>

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

### Supportate calendari (CalDAV) {#do-you-support-calendars-caldav}

Sì, dal 5 febbraio 2024 abbiamo aggiunto questa funzione. Il nostro server è `caldav.forwardemail.net` ed è anche monitorato sulla nostra <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">pagina di stato</a>.
Supporta sia IPv4 che IPv6 ed è disponibile sulla porta `443` (HTTPS).

| Login    | Esempio                   | Descrizione                                                                                                                                                                               |
| -------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Username | `user@example.com`        | Indirizzo email di un alias che esiste per il dominio in <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a>. |
| Password | `************************` | Password generata specifica per l'alias.                                                                                                                                                   |

Per utilizzare il supporto calendario, l'**utente** deve essere l'indirizzo email di un alias che esiste per il dominio in <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a> – e la **password** deve essere una password generata specifica per l'alias.

### Supportate attività e promemoria (CalDAV VTODO) {#do-you-support-tasks-and-reminders-caldav-vtodo}

Sì, dal 14 ottobre 2025 abbiamo aggiunto il supporto CalDAV VTODO per attività e promemoria. Questo utilizza lo stesso server del nostro supporto calendario: `caldav.forwardemail.net`.

Il nostro server CalDAV supporta sia gli eventi del calendario (VEVENT) sia i componenti attività (VTODO) utilizzando **calendari unificati**. Ciò significa che ogni calendario può contenere sia eventi che attività, offrendo la massima flessibilità e compatibilità con tutti i client CalDAV.

**Come funzionano calendari e liste:**

* **Ogni calendario supporta sia eventi che attività** - Puoi aggiungere eventi, attività o entrambi a qualsiasi calendario
* **Liste di Apple Promemoria** - Ogni lista che crei in Apple Promemoria diventa un calendario separato sul server
* **Più calendari** - Puoi creare tutti i calendari di cui hai bisogno, ciascuno con il proprio nome, colore e organizzazione
* **Sincronizzazione tra client** - Attività ed eventi si sincronizzano perfettamente tra tutti i client compatibili

**Client attività supportati:**

* **macOS Promemoria** - Supporto nativo completo per creazione, modifica, completamento e sincronizzazione delle attività
* **iOS Promemoria** - Supporto nativo completo su tutti i dispositivi iOS
* **Tasks.org (Android)** - Popolare gestore di attività open-source con sincronizzazione CalDAV
* **Thunderbird** - Supporto attività e calendario nel client email desktop
* **Qualsiasi gestore attività compatibile CalDAV** - Supporto standard del componente VTODO

**Funzionalità attività supportate:**

* Creazione, modifica e cancellazione delle attività
* Date di scadenza e date di inizio
* Stato di completamento dell'attività (NEEDS-ACTION, IN-PROCESS, COMPLETED, CANCELLED)
* Livelli di priorità delle attività
* Attività ricorrenti
* Descrizioni e note delle attività
* Sincronizzazione multi-dispositivo
* Sottoattività con proprietà RELATED-TO
* Promemoria attività con VALARM

Le credenziali di accesso sono le stesse del supporto calendario:

| Login    | Esempio                   | Descrizione                                                                                                                                                                               |
| -------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Username | `user@example.com`        | Indirizzo email di un alias che esiste per il dominio in <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a>. |
| Password | `************************` | Password generata specifica per l'alias.                                                                                                                                                   |

**Note importanti:**

* **Ogni lista di Promemoria è un calendario separato** - Quando crei una nuova lista in Apple Promemoria, viene creato un nuovo calendario sul server CalDAV
* **Utenti Thunderbird** - Dovrai iscriverti manualmente a ogni calendario/lista che vuoi sincronizzare, oppure usare l'URL della home calendar: `https://caldav.forwardemail.net/dav/your-email@domain.com/`
* **Utenti Apple** - La scoperta dei calendari avviene automaticamente, quindi tutti i tuoi calendari e liste appariranno in Calendar.app e Reminders.app
* **Calendari unificati** - Tutti i calendari supportano sia eventi che attività, offrendoti flessibilità nell'organizzazione dei dati
### Supportate i contatti (CardDAV) {#do-you-support-contacts-carddav}

Sì, dal 12 giugno 2025 abbiamo aggiunto questa funzionalità. Il nostro server è `carddav.forwardemail.net` ed è monitorato anche sulla nostra <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">pagina di stato</a>.

Supporta sia IPv4 che IPv6 ed è disponibile sulla porta `443` (HTTPS).

| Login    | Esempio                   | Descrizione                                                                                                                                                                               |
| -------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Username | `user@example.com`        | Indirizzo email di un alias esistente per il dominio in <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Il Mio Account <i class="fa fa-angle-right"></i> Domini</a>. |
| Password | `************************` | Password generata specifica per l'alias.                                                                                                                                                    |

Per utilizzare il supporto ai contatti, l'**utente** deve essere l'indirizzo email di un alias esistente per il dominio in <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Il Mio Account <i class="fa fa-angle-right"></i> Domini</a> – e la **password** deve essere una password generata specifica per l'alias.

### Supportate l'invio di email con SMTP {#do-you-support-sending-email-with-smtp}

Sì, da maggio 2023 supportiamo l'invio di email con SMTP come componente aggiuntivo per tutti gli utenti a pagamento.

<div id="smtp-instructions">

<div class="alert alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Assicurati di aver letto i nostri <a href="/terms" class="alert-link" target="_blank">Termini</a>, <a href="/privacy" class="alert-link" target="_blank">Informativa sulla Privacy</a> e <a href="/faq#what-are-your-outbound-smtp-limits" class="alert-link" target="_blank">Limiti SMTP in uscita</a> &ndash; il tuo utilizzo è considerato accettazione e accordo.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Se usi Gmail, consulta la nostra <a class="alert-link" href="/guides/send-mail-as-gmail-custom-domain">Guida Invia Mail Come con Gmail</a>. Se sei uno sviluppatore, consulta la nostra <a class="alert-link" href="/email-api#outbound-emails" target="_blank">documentazione API email</a>.
  </span>
</div>

1. Vai su <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">Il Mio Account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Impostazioni <i class="fa fa-angle-right"></i> Configurazione SMTP in uscita e segui le istruzioni di configurazione

2. Crea un nuovo alias per il tuo dominio in <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Il Mio Account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Alias (es. <code><hello@example.com></code>)

3. Clicca su <strong class="text-success"><i class="fa fa-key"></i> Genera Password</strong> accanto al nuovo alias creato. Copia negli appunti e conserva in modo sicuro la password generata mostrata a schermo.

4. Usando la tua applicazione email preferita, aggiungi o configura un account con il tuo alias appena creato (es. <code><hello@example.com></code>)
   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Suggerimento:
     </strong>
     <span>Consigliamo di usare <a class="alert-link" href="https://www.thunderbird.net/" target="_blank" rel="noopener noreferrer">Thunderbird</a>, <a class="alert-link" href="https://www.thunderbird.net/en-US/mobile/" target="_blank" rel="noopener noreferrer">Thunderbird Mobile</a>, <a class="alert-link" href="https://apps.apple.com/us/app/mail/id1108187098" target="_blank" rel="noopener noreferrer">Apple Mail</a> o <a href="/blog/open-source" class="alert-link" target="_blank">un'alternativa open-source e focalizzata sulla privacy</a>.</span>
   </div>
5. Quando richiesto il nome del server SMTP, inserisci `smtp.forwardemail.net`

6. Quando richiesto la porta del server SMTP, inserisci `465` (SSL/TLS) – vedi [porte SMTP alternative](/faq#what-are-your-smtp-server-configuration-settings) se necessario
   <div class="alert my-3 alert-warning">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Suggerimento:
     </strong>
     <span>Se usi Thunderbird, assicurati che "Sicurezza della connessione" sia impostata su "SSL/TLS" e il metodo di autenticazione sia impostato su "Password normale".</span>
   </div>

7. Quando richiesto la password del server SMTP, incolla la password da <strong class="text-success"><i class="fa fa-key"></i> Genera Password</strong> al punto 3 sopra

8. **Salva le tue impostazioni e invia la tua prima email di prova** – se riscontri problemi, ti preghiamo di <a href="/help">contattarci</a>

<div class="alert my-3 alert-primary">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Nota che per mantenere la reputazione IP e garantire la consegna, abbiamo un processo di revisione manuale per dominio per l'approvazione SMTP in uscita. Questo processo di solito richiede meno di 24 ore, con la maggior parte delle richieste evase entro 1-2 ore. Nel prossimo futuro puntiamo a rendere questo processo istantaneo con controlli antispam aggiuntivi e notifiche. Questo processo garantisce che le tue email raggiungano la casella di posta e che i tuoi messaggi non vengano contrassegnati come spam.
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

### Supportate OpenPGP/MIME, la crittografia end-to-end ("E2EE") e il Web Key Directory ("WKD") {#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd}

Sì, supportiamo [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy#OpenPGP), la [crittografia end-to-end ("E2EE")](https://en.wikipedia.org/wiki/End-to-end_encryption) e la scoperta delle chiavi pubbliche usando il [Web Key Directory ("WKD")](https://wiki.gnupg.org/WKD). Puoi configurare OpenPGP usando [keys.openpgp.org](https://keys.openpgp.org/about/usage#wkd-as-a-service) o [ospitare le tue chiavi autonomamente](https://wiki.gnupg.org/WKDHosting) (consulta [questo gist per la configurazione del server WKD](https://gist.github.com/kafene/0a6e259996862d35845784e6e5dbfc79)).

* Le ricerche WKD sono memorizzate nella cache per 1 ora per garantire una consegna tempestiva delle email → quindi se aggiungi, modifichi o rimuovi la tua chiave WKD, ti preghiamo di inviarci un'email a `support@forwardemail.net` con il tuo indirizzo email affinché possiamo svuotare manualmente la cache.
* Supportiamo la crittografia PGP per i messaggi inoltrati tramite ricerca WKD o usando una chiave PGP caricata nella nostra interfaccia.
* Le chiavi caricate prevalgono finché la casella PGP è abilitata/selezionata.
* I messaggi inviati ai webhook attualmente non sono crittografati con PGP.
* Se hai più alias che corrispondono a un dato indirizzo di inoltro (es. combinazione regex/wildcard/esatta) e se più di uno di questi contiene una chiave PGP caricata e ha PGP selezionato → ti invieremo un'email di errore e non crittografiamo il messaggio con la tua chiave PGP caricata. Questo è molto raro e di solito riguarda solo utenti avanzati con regole alias complesse.
* **La crittografia PGP non verrà applicata all'inoltro email tramite i nostri server MX se il mittente ha una policy DMARC di reject. Se necessiti la crittografia PGP su *tutte* le email, ti suggeriamo di usare il nostro servizio IMAP e configurare la tua chiave PGP per il tuo alias per la posta in arrivo.**

**Puoi validare la tua configurazione Web Key Directory su <https://wkd.chimbosonic.com/> (open-source) o <https://www.webkeydirectory.com/> (proprietario).**

<div class="alert my-3 alert-success">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Crittografia automatica:
  </strong>
  <span>Se usi il nostro <a href="#do-you-support-sending-email-with-smtp" class="alert-link">servizio SMTP in uscita</a> e invii messaggi non crittografati, tenteremo automaticamente di crittografare i messaggi su base per destinatario usando il <a class="alert-link" href="https://wiki.gnupg.org/WKD">Web Key Directory ("WKD")</a>.</span>
</div>
<div class="alert alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Devi seguire tutti i passaggi seguenti per abilitare OpenPGP per il tuo nome di dominio personalizzato.
  </span>
</div>

1. Scarica e installa il plugin consigliato per il tuo client di posta elettronica qui sotto:

   | Client di Posta | Piattaforma | Plugin Consigliato                                                                                                                                                                    | Note                                                                                                                                                                                                                                                                                                                                                                                                                                    |
   | --------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | Thunderbird     | Desktop     | [Configura OpenPGP in Thunderbird](https://support.mozilla.org/en-US/kb/openpgp-thunderbird-howto-and-faq#w_i-have-never-used-openpgp-with-thunderbird-before-how-do-i-setup-openpgp) | Thunderbird ha il supporto integrato per OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                        |
   | Gmail           | Browser     | [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download) (licenza proprietaria)                                                                            | Gmail non supporta OpenPGP, tuttavia puoi scaricare il plugin open-source [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                           |
   | Apple Mail      | macOS       | [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation)                                                                                          | Apple Mail non supporta OpenPGP, tuttavia puoi scaricare il plugin open-source [Free-GPGMail](https://github.com/Free-GPGMail/Free-GPGMail?tab=readme-ov-file#installation).                                                                                                                                                                                                                                                              |
   | Apple Mail      | iOS         | [PGPro](https://github.com/opensourceios/PGPro/) o [FlowCrypt](https://apps.apple.com/us/app/flowcrypt-encrypted-email/id1591754995) (licenza proprietaria)                           | Apple Mail non supporta OpenPGP, tuttavia puoi scaricare il plugin open-source [PGPro](https://github.com/opensourceios/PGPro/) o [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                           |
   | Outlook         | Windows     | [gpg4win](https://www.gpg4win.de/index.html)                                                                                                                                          | Il client di posta desktop di Outlook non supporta OpenPGP, tuttavia puoi scaricare il plugin open-source [gpg4win](https://www.gpg4win.de/index.html).                                                                                                                                                                                                                                                                                   |
   | Outlook         | Browser     | [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download) (licenza proprietaria)                                                                            | Il client di posta web di Outlook non supporta OpenPGP, tuttavia puoi scaricare il plugin open-source [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                               |
   | Android         | Mobile      | [OpenKeychain](https://www.openkeychain.org/) o [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email)                                                       | [Client di posta Android](/blog/open-source/android-email-clients) come [Thunderbird Mobile](https://www.thunderbird.net/en-US/mobile/) e [FairEmail](https://github.com/M66B/FairEmail) supportano entrambi il plugin open-source [OpenKeychain](https://www.openkeychain.org/). In alternativa puoi usare il plugin open-source (licenza proprietaria) [FlowCrypt](https://play.google.com/store/apps/details?id=com.flowcrypt.email). |
   | Google Chrome   | Browser     | [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download) (licenza proprietaria)                                                                            | Puoi scaricare l'estensione open-source per browser [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                                  |
   | Mozilla Firefox | Browser     | [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download) (licenza proprietaria)                                                                            | Puoi scaricare l'estensione open-source per browser [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                                  |
   | Microsoft Edge  | Browser     | [Mailvelope](https://mailvelope.com/)                                                                                                                                                 | Puoi scaricare l'estensione open-source per browser [Mailvelope](https://mailvelope.com/).                                                                                                                                                                                                                                                                                                                                               |
   | Brave           | Browser     | [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download) (licenza proprietaria)                                                                            | Puoi scaricare l'estensione open-source per browser [Mailvelope](https://mailvelope.com/) o [FlowCrypt](https://flowcrypt.com/download).                                                                                                                                                                                                                                                                                                  |
   | Balsa           | Desktop     | [Configura OpenPGP in Balsa](https://www.mynetcologne.de/~nc-dreszal/balsa/balsa23-secure-mail.html#USING)                                                                            | Balsa ha il supporto integrato per OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                               |
   | KMail           | Desktop     | [Configura OpenPGP in KMail](https://userbase.kde.org/KMail/PGP_MIME)                                                                                                                 | KMail ha il supporto integrato per OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                               |
   | GNOME Evolution | Desktop     | [Configura OpenPGP in Evolution](https://help.gnome.org/users/evolution/stable/mail-encryption.html.en)                                                                               | GNOME Evolution ha il supporto integrato per OpenPGP.                                                                                                                                                                                                                                                                                                                                                                                     |
   | Terminal        | Desktop     | [Configura gpg nel Terminale](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key#generating-a-gpg-key)                       | Puoi usare lo strumento open-source da linea di comando [gpg](https://www.gnupg.org/download/) per generare una nuova chiave da terminale.                                                                                                                                                                                                                                                                                               |
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
       Componenti aggiuntivi opzionali:
     </strong>
     <span>
       Se stai utilizzando il nostro servizio di <a class="alert-link" href="/blog/docs/best-quantum-safe-encrypted-email-service">archiviazione crittografata (IMAP/POP3)</a> e vuoi che <i>tutte</i> le email memorizzate nel tuo database SQLite (già crittografato) siano criptate con la tua chiave pubblica, allora vai su <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Il mio account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Alias (es. <code>hello@example.com</code>) <i class="fa fa-angle-right"></i> Modifica <i class="fa fa-angle-right"></i> OpenPGP e carica la tua chiave pubblica.
     </span>
   </div>

4. Aggiungi un nuovo record `CNAME` al tuo nome di dominio (es. `example.com`):

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
     <span>Se il tuo alias utilizza i nostri <a class="alert-link" href="/disposable-addresses" target="_blank">domini vanity/usa e getta</a> (es. <code>hideaddress.net</code>), puoi saltare questo passaggio.</span>
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

### Supportate la crittografia S/MIME {#do-you-support-smime-encryption}

Sì, supportiamo la crittografia [S/MIME (Secure/Multipurpose Internet Mail Extensions)](https://en.wikipedia.org/wiki/S/MIME) come definita in [RFC 8551](https://datatracker.ietf.org/doc/html/rfc8551). S/MIME fornisce crittografia end-to-end utilizzando certificati X.509, ampiamente supportati dai client di posta aziendali.

Supportiamo sia certificati RSA che ECC (Elliptic Curve Cryptography):

* **Certificati RSA**: minimo 2048 bit, consigliati 4096 bit
* **Certificati ECC**: curve NIST P-256, P-384 e P-521

Per configurare la crittografia S/MIME per il tuo alias:

1. Ottieni un certificato S/MIME da un'autorità di certificazione (CA) affidabile o genera un certificato autofirmato per test.

   <div class="alert my-3 alert-primary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Suggerimento:
     </strong>
     <span>Certificati S/MIME gratuiti sono disponibili da fornitori come <a class="alert-link" href="https://www.actalis.com/s-mime-certificates.aspx">Actalis</a> o <a class="alert-link" href="https://extrassl.actalis.com/portal/uapub/freemail">Actalis Free S/MIME</a>.</span>
   </div>

2. Esporta il tuo certificato in formato PEM (solo il certificato pubblico, non la chiave privata).

3. Vai su <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Il mio account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Alias (es. <code><hello@example.com></code>) <i class="fa fa-angle-right"></i> Modifica <i class="fa fa-angle-right"></i> S/MIME e carica il tuo certificato pubblico.
4. Una volta configurato, tutte le email in arrivo al tuo alias saranno criptate utilizzando il tuo certificato S/MIME prima di essere archiviate o inoltrate.

   <div class="alert my-3 alert-secondary">
     <i class="fa fa-info-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Nota:
     </strong>
     <span>
       La crittografia S/MIME viene applicata ai messaggi in arrivo che non sono già criptati. Se un messaggio è già criptato con OpenPGP o S/MIME, non verrà criptato nuovamente.
     </span>
   </div>

   <div class="alert my-3 alert-warning">
     <i class="fa fa-exclamation-circle font-weight-bold"></i>
     <strong class="font-weight-bold">
       Importante:
     </strong>
     <span>
       La crittografia S/MIME non verrà applicata all'inoltro delle email tramite i nostri server MX se il mittente aveva una policy DMARC di reject. Se necessiti della crittografia S/MIME su <em>tutte</em> le email, ti suggeriamo di utilizzare il nostro servizio IMAP e configurare il tuo certificato S/MIME per il tuo alias per la posta in arrivo.
     </span>
   </div>

I seguenti client email hanno supporto S/MIME integrato:

| Client Email      | Piattaforma | Note                                                                                                               |
| ----------------- | ----------- | ----------------------------------------------------------------------------------------------------------------- |
| Apple Mail        | macOS       | Supporto S/MIME integrato. Vai su Mail > Preferenze > Account > il tuo account > Fiducia per configurare i certificati.      |
| Apple Mail        | iOS         | Supporto S/MIME integrato. Vai su Impostazioni > Mail > Account > il tuo account > Avanzate > S/MIME per configurare.          |
| Microsoft Outlook | Windows     | Supporto S/MIME integrato. Vai su File > Opzioni > Centro protezione > Impostazioni Centro protezione > Sicurezza posta per configurare. |
| Microsoft Outlook | macOS       | Supporto S/MIME integrato. Vai su Strumenti > Account > Avanzate > Sicurezza per configurare.                                 |
| Thunderbird       | Desktop     | Supporto S/MIME integrato. Vai su Impostazioni account > Crittografia end-to-end > S/MIME per configurare.                      |
| GNOME Evolution   | Desktop     | Supporto S/MIME integrato. Vai su Modifica > Preferenze > Account di posta > il tuo account > Sicurezza per configurare.           |
| KMail             | Desktop     | Supporto S/MIME integrato. Vai su Impostazioni > Configura KMail > Identità > la tua identità > Crittografia per configurare. |

<div class="text-center my-3 my-md-5">
  <div class="alert my-3 alert-success d-inline-block">
    <i class="fa fa-check-circle font-weight-bold"></i>
    <strong class="font-weight-bold">
      Congratulazioni!
    </strong>
    <span>
      Hai configurato con successo la crittografia S/MIME per il tuo alias.
    </span>
  </div>
</div>

### Supportate il filtraggio email Sieve {#do-you-support-sieve-email-filtering}

Sì! Supportiamo il filtraggio email [Sieve](https://en.wikipedia.org/wiki/Sieve_\(mail_filtering_language\)) come definito in [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228). Sieve è un potente linguaggio di scripting standardizzato per il filtraggio della posta lato server che ti permette di organizzare, filtrare e rispondere automaticamente ai messaggi in arrivo.

#### Estensioni Sieve supportate {#supported-sieve-extensions}

Supportiamo un set completo di estensioni Sieve:

| Estensione                  | RFC                                                                                   | Descrizione                                      |
| --------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `fileinto`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                             | Inserisce i messaggi in cartelle specifiche      |
| `reject` / `ereject`        | [RFC 5429](https://datatracker.ietf.org/doc/html/rfc5429)                             | Rifiuta i messaggi con un errore                  |
| `vacation`                  | [RFC 5230](https://datatracker.ietf.org/doc/html/rfc5230)                             | Risposte automatiche di assenza/vacanza           |
| `vacation-seconds`          | [RFC 6131](https://datatracker.ietf.org/doc/html/rfc6131)                             | Intervalli di risposta per vacanza più dettagliati|
| `imap4flags`                | [RFC 5232](https://datatracker.ietf.org/doc/html/rfc5232)                             | Imposta flag IMAP (\Seen, \Flagged, ecc.)         |
| `envelope`                  | [RFC 5228](https://datatracker.ietf.org/doc/html/rfc5228)                             | Testa mittente/destinatario dell'involucro       |
| `body`                      | [RFC 5173](https://datatracker.ietf.org/doc/html/rfc5173)                             | Testa il contenuto del corpo del messaggio        |
| `variables`                 | [RFC 5229](https://datatracker.ietf.org/doc/html/rfc5229)                             | Memorizza e usa variabili negli script             |
| `relational`                | [RFC 5231](https://datatracker.ietf.org/doc/html/rfc5231)                             | Confronti relazionali (maggiore, minore)          |
| `comparator-i;ascii-numeric`| [RFC 4790](https://datatracker.ietf.org/doc/html/rfc4790)                             | Confronti numerici                                 |
| `copy`                      | [RFC 3894](https://datatracker.ietf.org/doc/html/rfc3894)                             | Copia i messaggi durante il reindirizzamento      |
| `editheader`                | [RFC 5293](https://datatracker.ietf.org/doc/html/rfc5293)                             | Aggiunge o elimina intestazioni dei messaggi      |
| `date`                      | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                             | Testa valori di data/ora                           |
| `index`                     | [RFC 5260](https://datatracker.ietf.org/doc/html/rfc5260)                             | Accede a occorrenze specifiche dell'intestazione  |
| `regex`                     | [draft-ietf-sieve-regex](https://datatracker.ietf.org/doc/html/draft-ietf-sieve-regex)| Corrispondenza con espressioni regolari           |
| `enotify`                   | [RFC 5435](https://datatracker.ietf.org/doc/html/rfc5435)                             | Invia notifiche (es. mailto:)                      |
| `environment`               | [RFC 5183](https://datatracker.ietf.org/doc/html/rfc5183)                             | Accede alle informazioni ambientali                |
| `mailbox`                   | [RFC 5490](https://datatracker.ietf.org/doc/html/rfc5490)                             | Testa l'esistenza di caselle, crea caselle         |
| `special-use`               | [RFC 8579](https://datatracker.ietf.org/doc/html/rfc8579)                             | Inserisce in caselle ad uso speciale (\Junk, \Trash)|
| `duplicate`                 | [RFC 7352](https://datatracker.ietf.org/doc/html/rfc7352)                             | Rileva messaggi duplicati                          |
| `ihave`                     | [RFC 5463](https://datatracker.ietf.org/doc/html/rfc5463)                             | Testa la disponibilità di estensioni              |
| `subaddress`                | [RFC 5233](https://datatracker.ietf.org/doc/html/rfc5233)                             | Accede alle parti dell'indirizzo user+detail      |
#### Estensioni Non Supportate {#extensions-not-supported}

Le seguenti estensioni non sono attualmente supportate:

| Estensione                                                     | Motivo                                                              |
| -------------------------------------------------------------- | ------------------------------------------------------------------ |
| `include`                                                      | Rischio di sicurezza (iniezione di script) e richiede archiviazione globale degli script |
| `mboxmetadata` / `servermetadata`                              | Richiede il supporto dell'estensione IMAP METADATA                 |
| `foreverypart` / `mime` / `extracttext` / `replace` / `enclose` | Manipolazione complessa dell'albero MIME non ancora implementata   |

#### Esempi di Script Sieve {#example-sieve-scripts}

**Archiviare le newsletter in una cartella:**

```sieve
require ["fileinto"];

if header :contains "List-Id" "newsletter" {
    fileinto "Newsletters";
}
```

**Risposta automatica durante le vacanze:**

```sieve
require ["vacation"];

vacation :days 7 :subject "Fuori Ufficio"
    "Attualmente sono fuori ufficio e risponderò al mio ritorno.";
```

**Contrassegnare i messaggi da mittenti importanti:**

```sieve
require ["imap4flags"];

if address :is "from" "boss@example.com" {
    setflag "\\Flagged";
}
```

**Rifiutare lo spam con soggetti specifici:**

```sieve
require ["reject"];

if header :contains "subject" ["lottery", "winner", "urgent transfer"] {
    reject "Messaggio rifiutato a causa di contenuto spam.";
}
```

#### Gestione degli Script Sieve {#managing-sieve-scripts}

Puoi gestire i tuoi script Sieve in diversi modi:

1. **Interfaccia Web**: Vai su <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Il Mio Account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Alias <i class="fa fa-angle-right"></i> Script Sieve per creare e gestire gli script.

2. **Protocollo ManageSieve**: Connettiti usando qualsiasi client compatibile con ManageSieve (come il componente aggiuntivo Sieve di Thunderbird o [sieve-connect](https://github.com/philpennock/sieve-connect)) a `imap.forwardemail.net`. Usa la porta `2190` con STARTTLS (consigliato per la maggior parte dei client) o la porta `4190` con TLS implicito.

3. **API**: Usa la nostra [REST API](/api#sieve-scripts) per gestire gli script programmaticamente.

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Nota:
  </strong>
  <span>
    Il filtraggio Sieve viene applicato ai messaggi in arrivo prima che vengano archiviati nella tua casella di posta. Gli script vengono eseguiti in ordine di priorità e la prima azione corrispondente determina come viene gestito il messaggio.
  </span>
</div>

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Sicurezza:
  </strong>
  <span>
    Per motivi di sicurezza, le azioni di reindirizzamento sono limitate a 10 per script e 100 al giorno. Le risposte automatiche per le vacanze sono limitate per prevenire abusi.
  </span>
</div>

### Supportate MTA-STS? {#do-you-support-mta-sts}

Sì, dal 2 marzo 2023 supportiamo [MTA-STS](https://www.hardenize.com/blog/mta-sts). Puoi usare [questo modello](https://github.com/jpawlowski/mta-sts.template) se desideri abilitarlo sul tuo dominio.

La nostra configurazione è pubblicamente disponibile su GitHub all'indirizzo <https://github.com/forwardemail/mta-sts.forwardemail.net>.

### Supportate passkey e WebAuthn? {#do-you-support-passkeys-and-webauthn}

Sì! Dal 13 dicembre 2023 abbiamo aggiunto il supporto per le passkey [a causa dell'elevata richiesta](https://github.com/orgs/forwardemail/discussions/182).

Le passkey ti permettono di accedere in modo sicuro senza richiedere una password e l'autenticazione a due fattori.

Puoi convalidare la tua identità con il tocco, il riconoscimento facciale, una password basata sul dispositivo o un PIN.

Ti permettiamo di gestire fino a 30 passkey contemporaneamente, così puoi accedere facilmente con tutti i tuoi dispositivi.

Scopri di più sulle passkey ai seguenti link:

* [Accedi alle tue applicazioni e siti web con le passkey](https://support.google.com/android/answer/14124480?hl=en) (Google)
* [Usa le passkey per accedere ad app e siti web su iPhone](https://support.apple.com/guide/iphone/use-passkeys-to-sign-in-to-apps-and-websites-iphf538ea8d0/ios) (Apple)
* [Articolo di Wikipedia sulle Passkey](https://en.wikipedia.org/wiki/Passkey_\(credential\))
### Supportate le migliori pratiche email {#do-you-support-email-best-practices}

Sì. Abbiamo il supporto integrato per SPF, DKIM, DMARC, ARC e SRS in tutti i piani. Abbiamo inoltre collaborato ampiamente con gli autori originali di queste specifiche e altri esperti di email per garantire perfezione e alta deliverability.

### Supportate i webhook per i bounce {#do-you-support-bounce-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Suggerimento:
  </strong>
    Cerchi documentazione sui webhook email? Vedi <a href="/faq#do-you-support-webhooks" class="alert-link">Supportate i webhook?</a> per maggiori informazioni.
  <span>
  </span>
</div>

Sì, dal 14 agosto 2024 abbiamo aggiunto questa funzionalità. Ora puoi andare su Il Mio Account → Domini → Impostazioni → URL Webhook Bounce e configurare un URL `http://` o `https://` a cui invieremo una richiesta `POST` ogni volta che un'email SMTP in uscita genera un bounce.

Questo è utile per gestire e monitorare le tue email SMTP in uscita – e può essere usato per mantenere gli iscritti, gestire le disiscrizioni e rilevare ogni volta che si verifica un bounce.

I payload dei webhook bounce sono inviati come JSON con queste proprietà:

* `email_id` (String) - ID email che corrisponde a un'email in Il Mio Account → Email (SMTP in uscita)
* `list_id` (String) - valore dell'intestazione `List-ID` (case-insensitive), se presente, dall'email originale in uscita
* `list_unsubscribe` (String) - valore dell'intestazione `List-Unsubscribe` (case-insensitive), se presente, dall'email originale in uscita
* `feedback_id` (String) - valore dell'intestazione `Feedback-ID` (case-insensitive), se presente, dall'email originale in uscita
* `recipient` (String) - indirizzo email del destinatario che ha generato il bounce o errore
* `message` (String) - messaggio di errore dettagliato per il bounce
* `response` (String) - messaggio di risposta SMTP
* `response_code` (Number) - codice di risposta SMTP analizzato
* `truth_source` (String) - se il codice di risposta proviene da una fonte attendibile, questo valore sarà popolato con il nome del dominio principale (es. `google.com` o `yahoo.com`)
* `bounce` (Object) - oggetto contenente le seguenti proprietà che dettagliano lo stato del bounce e del rifiuto
  * `action` (String) - azione del bounce (es. `"reject"`)
  * `message` (String) - motivo del bounce (es. `"Message Sender Blocked By Receiving Server"`)
  * `category` (String) - categoria del bounce (es. `"block"`)
  * `code` (Number) - codice di stato del bounce (es. `554`)
  * `status` (String) - codice del bounce dal messaggio di risposta (es. `5.7.1`)
  * `line` (Number) - numero di linea analizzato, se presente, [dalla lista di parsing bounce di Zone-MTA](https://github.com/zone-eu/zone-mta/blob/master/config/bounces.txt) (es. `526`)
* `headers` (Object) - coppie chiave-valore delle intestazioni per l'email in uscita
* `bounced_at` (String) - data formattata secondo lo standard [ISO 8601](https://en.wikipedia.org/wiki/ISO\_8601) di quando si è verificato l'errore di bounce

Per esempio:

```json
{
  "email_id": "66bcce793ef7b2a0928e14ba",
  "recipient": "example@gmail.com",
  "message": "L'account email che hai provato a raggiungere ha superato la quota.",
  "response": "552 5.2.2 L'account email che hai provato a raggiungere ha superato la quota.",
  "response_code": 552,
  "truth_source": "google.com",
  "bounce": {
    "action": "reject",
    "message": "Casella Gmail piena",
    "category": "capacity",
    "code": 552,
    "status": "5.2.2",
    "line": 300
  },
  "headers": {},
  "bounced_at": "2024-08-24T01:50:02.828Z"
}
```

Ecco alcune note aggiuntive riguardo ai webhook bounce:

* Se il payload del webhook contiene un valore `list_id`, `list_unsubscribe` o `feedback_id`, allora dovresti prendere le azioni appropriate per rimuovere il `recipient` dalla lista se necessario.
  * Se il valore `bounce.category` era uno tra `"block"`, `"recipient"`, `"spam"` o `"virus"`, allora dovresti sicuramente rimuovere l'utente dalla lista.
* Se hai bisogno di verificare i payload dei webhook (per assicurarti che provengano effettivamente dal nostro server), puoi [risolvere l'indirizzo IP remoto del client usando una ricerca inversa](https://nodejs.org/api/dns.html#dnspromisesreverseip) – dovrebbe essere `smtp.forwardemail.net`.
  * Puoi anche controllare l'IP rispetto ai [nostri indirizzi IP pubblicati](#what-are-your-servers-ip-addresses).
  * Vai su Il Mio Account → Domini → Impostazioni → Chiave di Verifica Payload Firma Webhook per ottenere la tua chiave webhook.
    * Puoi ruotare questa chiave in qualsiasi momento per motivi di sicurezza.
    * Calcola e confronta il valore `X-Webhook-Signature` dalla nostra richiesta webhook con il valore del corpo calcolato usando questa chiave. Un esempio di come farlo è disponibile in [questo post di Stack Overflow](https://stackoverflow.com/a/68885281).
  * Vedi la discussione su <https://github.com/forwardemail/free-email-forwarding/issues/235> per maggiori dettagli.
* Attenderemo fino a `5` secondi che il tuo endpoint webhook risponda con un codice di stato `200`, e riproveremo fino a `1` volta.
* Se rileviamo che il tuo URL webhook bounce ha un errore mentre tentiamo di inviare una richiesta, ti invieremo una email di cortesia una volta a settimana.
### Supportate i webhook {#do-you-support-webhooks}

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Suggerimento:
  </strong>
    Cerchi la documentazione sui webhook di bounce? Consulta <a href="/faq#do-you-support-bounce-webhooks" class="alert-link">Supportate i webhook di bounce?</a> per maggiori informazioni.
  <span>
  </span>
</div>

Sì, dal 15 maggio 2020 abbiamo aggiunto questa funzionalità. Puoi semplicemente aggiungere webhook esattamente come faresti con qualsiasi destinatario! Assicurati che l'URL del webhook abbia il prefisso del protocollo "http" o "https".

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Protezione della privacy migliorata:
  </strong>
  <span>
    Se sei su un piano a pagamento (che include la protezione della privacy migliorata), vai su <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Il mio account <i class="fa fa-angle-right"></i> Domini</a> e clicca su "Alias" accanto al tuo dominio per configurare i tuoi webhook. Se vuoi saperne di più sui piani a pagamento, consulta la nostra pagina <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Prezzi</a>. Altrimenti puoi continuare a seguire le istruzioni qui sotto.
  </span>
</div>

Se sei sul piano gratuito, aggiungi semplicemente un nuovo record DNS <strong class="notranslate">TXT</strong> come mostrato di seguito:

Ad esempio, se voglio che tutte le email inviate a `alias@example.com` vengano inoltrate a un nuovo endpoint di test [request bin](https://requestbin.com/r/en8pfhdgcculn?inspect):

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
      <td><code>forward-email=alias:https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

Oppure vuoi che tutte le email inviate a `example.com` vengano inoltrate a questo endpoint:

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
      <td><code>forward-email=https://requestbin.com/r/en8pfhdgcculn</code></td>
    </tr>
  </tbody>
</table>

**Ecco alcune note aggiuntive riguardo ai webhook:**

* Se hai bisogno di verificare i payload dei webhook (per assicurarti che provengano effettivamente dal nostro server), puoi [risolvere l'indirizzo IP remoto del client o il nome host usando una ricerca inversa](https://nodejs.org/api/dns.html#dnspromisesreverseip) – dovrebbe essere `mx1.forwardemail.net` o `mx2.forwardemail.net`.
  * Puoi anche controllare l'IP rispetto ai [nostri indirizzi IP pubblicati](#what-are-your-servers-ip-addresses).
  * Se sei su un piano a pagamento, vai su Il mio account → Domini → Impostazioni → Chiave di verifica del payload della firma webhook per ottenere la tua chiave webhook.
    * Puoi ruotare questa chiave in qualsiasi momento per motivi di sicurezza.
    * Calcola e confronta il valore `X-Webhook-Signature` dalla nostra richiesta webhook con il valore del corpo calcolato usando questa chiave. Un esempio di come farlo è disponibile in [questo post di Stack Overflow](https://stackoverflow.com/a/68885281).
  * Consulta la discussione su <https://github.com/forwardemail/free-email-forwarding/issues/235> per maggiori dettagli.
* Se un webhook non risponde con un codice di stato `200`, memorizzeremo la sua risposta nel [registro errori creato](#do-you-store-error-logs) – utile per il debug.
* Le richieste HTTP dei webhook verranno ritentate fino a 3 volte per ogni tentativo di connessione SMTP, con un timeout massimo di 60 secondi per ogni richiesta POST all'endpoint. **Nota che questo non significa che ritenta solo 3 volte**, in realtà ritenterà continuamente nel tempo inviando un codice SMTP 421 (che indica al mittente di riprovare più tardi) dopo il terzo tentativo fallito di richiesta POST HTTP. Ciò significa che l'email verrà ritentata continuamente per giorni fino a quando non si ottiene un codice di stato 200.
* Ritenteremo automaticamente basandoci sui codici di stato e di errore predefiniti usati nel [metodo retry di superagent](https://ladjs.github.io/superagent/#retrying-requests) (di cui siamo manutentori).
* Raggruppiamo insieme le richieste HTTP dei webhook allo stesso endpoint in una sola richiesta invece di molteplici, per risparmiare risorse e velocizzare i tempi di risposta. Ad esempio, se invii un'email a <webhook1@example.com>, <webhook2@example.com> e <webhook3@example.com>, e tutti sono configurati per colpire lo stesso URL *esatto* dell'endpoint, verrà effettuata una sola richiesta. Raggruppiamo per corrispondenza esatta dell'endpoint con uguaglianza stretta.
* Nota che usiamo il metodo "simpleParser" della libreria [mailparser](https://nodemailer.com/extras/mailparser/) per analizzare il messaggio in un oggetto JSON-friendly.
* Il valore raw dell'email come Stringa è fornito nella proprietà "raw".
* I risultati di autenticazione sono forniti come proprietà "dkim", "spf", "arc", "dmarc" e "bimi".
* Le intestazioni email analizzate sono fornite nella proprietà "headers" – ma nota anche che puoi usare "headerLines" per una iterazione e analisi più semplice.
* I destinatari raggruppati per questo webhook sono raggruppati insieme e forniti nella proprietà "recipients".
* Le informazioni della sessione SMTP sono fornite nella proprietà "session". Contiene informazioni sul mittente del messaggio, l'orario di arrivo del messaggio, HELO e nome host del client. Il valore del nome host del client come `session.clientHostname` è o il FQDN (da una ricerca PTR inversa) o è `session.remoteAddress` racchiuso tra parentesi (es. `"[127.0.0.1]"`).
* Se hai bisogno di un modo rapido per ottenere il valore di `X-Original-To`, puoi usare il valore di `session.recipient` (vedi esempio sotto). L'intestazione `X-Original-To` è un'intestazione che aggiungiamo ai messaggi per il debug con il destinatario originale (prima dell'inoltro mascherato) del messaggio.
* Se hai bisogno di rimuovere le proprietà `attachments` e/o `raw` dal corpo del payload, aggiungi semplicemente `?attachments=false`, `?raw=false` o `?attachments=false&raw=false` al tuo endpoint webhook come parametro di query (es. `https://example.com/webhook?attachments=false&raw=false`).
* Se ci sono allegati, verranno aggiunti all'Array `attachments` con valori Buffer. Puoi analizzarli nuovamente in contenuto usando un approccio con JavaScript come:
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
    Tip:
  </strong>
    Curious what the webhook request looks like from forwarded emails?  We've included an example below for you!
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

### Supportate le espressioni regolari o regex {#do-you-support-regular-expressions-or-regex}

Sì, dal 27 settembre 2021 abbiamo aggiunto questa funzionalità. Puoi semplicemente scrivere espressioni regolari ("regex") per abbinare alias ed eseguire sostituzioni.

Gli alias supportati con espressioni regolari sono quelli che iniziano con `/` e finiscono con `/` e i loro destinatari sono indirizzi email o webhook. I destinatari possono anche includere il supporto per la sostituzione regex (es. `$1`, `$2`).

Supportiamo due flag per le espressioni regolari, inclusi `i` e `g`. Il flag case-insensitive `i` è un'impostazione predefinita permanente ed è sempre applicato. Il flag globale `g` può essere aggiunto da te aggiungendo `/g` alla fine della regex.

Nota che supportiamo anche la nostra <a href="#can-i-disable-specific-aliases">funzionalità di alias disabilitati</a> per la parte destinatario con il supporto regex.

Le espressioni regolari non sono supportate su <a href="/disposable-addresses" target="_blank">domini vanity globali</a> (poiché potrebbe rappresentare una vulnerabilità di sicurezza).

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Protezione della Privacy Avanzata:
  </strong>
  <span>
    Se sei su un piano a pagamento (che include la protezione della privacy avanzata), vai su <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Il Mio Account <i class="fa fa-angle-right"></i> Domini</a> e clicca su "Alias" accanto al tuo dominio per configurare alias, inclusi quelli con espressioni regolari. Se vuoi saperne di più sui piani a pagamento, consulta la nostra pagina <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Prezzi</a>.
  </span>
</div>

#### Esempi per la Protezione della Privacy Avanzata {#examples-for-enhanced-privacy-protection}

<table class="table table-striped table-hover my-3">
  <thead class="thead-dark">
    <tr>
      <th>Nome Alias</th>
      <th>Effetto</th>
      <th>Test</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>/^(linus|torvalds)$/</code></td>
      <td>Email a `linus@example.com` o `torvalds@example.com`</td>
      <td>(<a href="https://regexr.com/8gb8n" class="alert-link">visualizza test su RegExr</a>)</td>
    </tr>
    <tr>
      <td><code>/^24highst(reet)$/</code></td>
      <td>Email a `24highst@example.com` o `24highstreet@example.com`</td>
      <td>(<a href="https://regexr.com/8g9rb" class="alert-link">visualizza test su RegExr</a>)</td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Suggerimento:
  </strong>
    Per testare queste espressioni su <a href="https://regexr.com" class="alert-link">RegExr</a>, scrivi l'espressione nella casella superiore, quindi digita un alias di esempio nella casella di testo sottostante. Se corrisponde, diventerà blu.
  <span>
  </span>
</div>

#### Esempi per il piano gratuito {#examples-for-the-free-plan}

Se sei sul piano gratuito, aggiungi semplicemente un nuovo record DNS <strong class="notranslate">TXT</strong> utilizzando uno o più degli esempi forniti di seguito:

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Esempio Semplice:</strong> Se voglio che tutte le email inviate a `linus@example.com` o `torvalds@example.com` vengano inoltrate a `user@gmail.com`:
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
  <strong>Esempio di Sostituzione Nome Cognome:</strong> Immagina che tutti gli indirizzi email della tua azienda seguano il modello `firstname.lastname@example.com`. Se voglio che tutte le email inviate al modello `firstname.lastname@example.com` vengano inoltrate a `firstname.lastname@company.com` con supporto per la sostituzione (<a href="https://regexr.com/66hnu" class="alert-link">visualizza test su RegExr</a>):
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
      <td><code>forward-email=/^([A-Za-z]+)+\.([A-Za-z]+)+$/:$1.$2@company.com</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Esempio di sostituzione con simbolo più:</strong> Se voglio che tutte le email che vanno a `info@example.com` o `support@example.com` vengano inoltrate rispettivamente a `user+info@gmail.com` o `user+support@gmail.com` (con supporto alla sostituzione) (<a href="https://regexr.com/66ho7" class="alert-link">vedi test su RegExr</a>):
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
  <strong>Esempio di sostituzione querystring webhook:</strong> Forse vuoi che tutte le email che vanno a `example.com` vadano a un <a href="#do-you-support-webhooks" class="alert-link">webhook</a> e abbiano una chiave querystring dinamica "to" con valore la parte username dell'indirizzo email (<a href="https://regexr.com/66ho4" class="alert-link">vedi test su RegExr</a>):
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
      <td><code>forward-email=/^(.*?)$/:https://example.com/webhook?username=$1</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-secondary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong>Esempio di rifiuto silenzioso:</strong> Se vuoi che tutte le email che corrispondono a un certo pattern siano disabilitate e rifiutate silenziosamente (appare al mittente come se il messaggio fosse stato inviato con successo, ma in realtà non arriva da nessuna parte) con codice di stato `250` (vedi <a href="#can-i-disable-specific-aliases" class="alert-link">Posso disabilitare alias specifici</a>), allora usa semplicemente lo stesso approccio con un singolo punto esclamativo "!". Questo indica al mittente che il messaggio è stato consegnato con successo, ma in realtà è andato perso (es. blackhole o `/dev/null`).
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
  <strong>Esempio di rifiuto soft:</strong> Se vuoi che tutte le email che corrispondono a un certo pattern siano disabilitate e rifiutate soft con codice di stato `421` (vedi <a href="#can-i-disable-specific-aliases" class="alert-link">Posso disabilitare alias specifici</a>), allora usa semplicemente lo stesso approccio con un doppio punto esclamativo "!!". Questo indica al mittente di ritentare l'invio, e le email a questo alias saranno ritentate per circa 5 giorni e poi rifiutate definitivamente.
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
  <strong>Esempio di rifiuto definitivo:</strong> Se vuoi che tutte le email che corrispondono a un certo modello vengano disabilitate e rifiutate definitivamente con codice di stato `550` (vedi <a href="#can-i-disable-specific-aliases" class="alert-link">Posso disabilitare alias specifici</a>), allora usa semplicemente lo stesso approccio con un triplo punto esclamativo "!!!". Questo indica al mittente un errore permanente e le email non verranno ritentate, saranno rifiutate per questo alias.
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
    Curioso di sapere come scrivere un'espressione regolare o hai bisogno di testare la tua sostituzione? Puoi andare al sito gratuito per testare espressioni regolari <a href="https://regexr.com" class="alert-link">RegExr</a> su <a href="https://regexr.com/" class="alert-link">https://regexr.com</a>.
  <span>
  </span>
</div>

### Quali sono i tuoi limiti SMTP in uscita {#what-are-your-outbound-smtp-limits}

Applichiamo un limite di 300 messaggi SMTP in uscita per utente e dominio ogni 1 giorno. Questo corrisponde in media a oltre 9000 email in un mese solare. Se hai bisogno di superare questa quantità o hai email costantemente di grandi dimensioni, ti preghiamo di [contattarci](https://forwardemail.net/help).

### Ho bisogno di approvazione per abilitare SMTP {#do-i-need-approval-to-enable-smtp}

Sì, tieni presente che per mantenere la reputazione IP e garantire la consegnabilità, Forward Email ha un processo di revisione manuale per dominio per l'approvazione SMTP in uscita. Invia una email a <support@forwardemail.net> o apri una [richiesta di assistenza](https://forwardemail.net/help) per l'approvazione. Questo processo di solito richiede meno di 24 ore, con la maggior parte delle richieste evase entro 1-2 ore. Nel prossimo futuro puntiamo a rendere questo processo istantaneo con controlli antispam aggiuntivi e notifiche. Questo processo garantisce che le tue email raggiungano la casella di posta e che i tuoi messaggi non vengano contrassegnati come spam.

### Quali sono le impostazioni di configurazione del tuo server SMTP {#what-are-your-smtp-server-configuration-settings}

Il nostro server è `smtp.forwardemail.net` ed è anche monitorato sulla nostra <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">pagina di stato</a>.

Supporta sia IPv4 che IPv6 ed è disponibile sulle porte `465` e `2465` per SSL/TLS (consigliato) e `587`, `2587`, `2525` e `25` per TLS (STARTTLS).

**Da ottobre 2025**, supportiamo ora le connessioni **TLS 1.0 legacy** sulle porte `2455` (SSL/TLS) e `2555` (STARTTLS) per dispositivi più vecchi come stampanti, scanner, fotocamere e client email legacy che non possono supportare versioni TLS moderne. Queste porte sono fornite come alternativa a Gmail, Yahoo, Outlook e altri provider che hanno interrotto il supporto per i protocolli TLS più vecchi.

> \[!CAUTION]
> **Supporto TLS 1.0 Legacy (Porte 2455 e 2555)**: Queste porte utilizzano il protocollo TLS 1.0 deprecato che presenta vulnerabilità di sicurezza note (BEAST, POODLE). Usa queste porte solo se il tuo dispositivo non può assolutamente supportare TLS 1.2 o superiore. Raccomandiamo vivamente di aggiornare il firmware del dispositivo o di passare a client email moderni quando possibile. Queste porte sono destinate esclusivamente alla compatibilità con hardware legacy (vecchie stampanti, scanner, fotocamere, dispositivi IoT).

|                                     Protocollo                                     | Nome host               |            Porte            |        IPv4        |        IPv6        | Note                                   |
| :------------------------------------------------------------------------------: | ----------------------- | :-------------------------: | :----------------: | :----------------: | -------------------------------------- |
|                              `SSL/TLS` **Consigliato**                            | `smtp.forwardemail.net` |        `465`, `2465`        | :white_check_mark: | :white_check_mark: | TLS moderno 1.2+ (Consigliato)         |
|         `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS))         | `smtp.forwardemail.net` | `587`, `2587`, `2525`, `25` | :white_check_mark: | :white_check_mark: | Supportato (preferire porta SSL/TLS `465`) |
|                             `SSL/TLS` **Solo Legacy**                            | `smtp.forwardemail.net` |            `2455`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 solo per dispositivi vecchi |
| `TLS` ([STARTTLS](https://wikipedia.org/wiki/Opportunistic_TLS)) **Solo Legacy** | `smtp.forwardemail.net` |            `2555`           | :white_check_mark: | :white_check_mark: | :warning: TLS 1.0 solo per dispositivi vecchi |
| Login    | Esempio                   | Descrizione                                                                                                                                                                              |
| -------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Username | `user@example.com`        | Indirizzo email di un alias che esiste per il dominio in <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a>. |
| Password | `************************` | Alias                                                                                                                                                                                    |

Per inviare email in uscita con SMTP, l'**utente SMTP** deve essere l'indirizzo email di un alias che esiste per il dominio in <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a> – e la **password SMTP** deve essere una password generata specifica per l'alias.

Si prega di fare riferimento a [Supportate l'invio di email con SMTP](#do-you-support-sending-email-with-smtp) per istruzioni passo passo.

### Quali sono le impostazioni di configurazione del server IMAP {#what-are-your-imap-server-configuration-settings}

Il nostro server è `imap.forwardemail.net` ed è monitorato anche sulla nostra <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">pagina di stato</a>.

Supporta sia IPv4 che IPv6 ed è disponibile sulle porte `993` e `2993` per SSL/TLS.

|         Protocollo        | Nome host               |     Porte     |        IPv4        |        IPv6        |
| :-----------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Preferito**    | `imap.forwardemail.net` | `993`, `2993` | :white_check_mark: | :white_check_mark: |

| Login    | Esempio                   | Descrizione                                                                                                                                                                              |
| -------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Username | `user@example.com`        | Indirizzo email di un alias che esiste per il dominio in <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a>. |
| Password | `************************` | Password generata specifica per l'alias.                                                                                                                                                   |

Per connettersi con IMAP, l'**utente IMAP** deve essere l'indirizzo email di un alias che esiste per il dominio in <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a> – e la **password IMAP** deve essere una password generata specifica per l'alias.

Si prega di fare riferimento a [Supportate la ricezione di email con IMAP](#do-you-support-receiving-email-with-imap) per istruzioni passo passo.

### Quali sono le impostazioni di configurazione del server POP3 {#what-are-your-pop3-server-configuration-settings}

Il nostro server è `pop3.forwardemail.net` ed è monitorato anche sulla nostra <a href="https://status.forwardemail.net" target="_blank" rel="noopener noreferrer">pagina di stato</a>.

Supporta sia IPv4 che IPv6 ed è disponibile sulle porte `995` e `2995` per SSL/TLS.

|         Protocollo        | Nome host               |     Porte     |        IPv4        |        IPv6        |
| :-----------------------: | ----------------------- | :-----------: | :----------------: | :----------------: |
| `SSL/TLS` **Preferito**    | `pop3.forwardemail.net` | `995`, `2995` | :white_check_mark: | :white_check_mark: |
| Login    | Esempio                   | Descrizione                                                                                                                                                                               |
| -------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Username | `user@example.com`        | Indirizzo email di un alias che esiste per il dominio in <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a>. |
| Password | `************************` | Password generata specifica per l'alias.                                                                                                                                                   |

Per connettersi con POP3, l'**utente POP3** deve essere l'indirizzo email di un alias che esiste per il dominio in <a href="/my-account/domains" target="_blank" rel="noopener noreferrer">Il mio account <i class="fa fa-angle-right"></i> Domini</a> – e la **password IMAP** deve essere una password generata specifica per l'alias.

Si prega di fare riferimento a [Supportate POP3](#do-you-support-pop3) per istruzioni passo passo.

### Come configuro l'autodiscovery email per il mio dominio {#how-do-i-set-up-email-autodiscovery-for-my-domain}

L'autodiscovery email permette ai client di posta come **Thunderbird**, **Apple Mail**, **Microsoft Outlook** e dispositivi mobili di rilevare automaticamente le corrette impostazioni dei server IMAP, SMTP, POP3, CalDAV e CardDAV quando un utente aggiunge il proprio account email. Questo è definito da [RFC 6186](https://www.rfc-editor.org/rfc/rfc6186.html) (email) e [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) (CalDAV/CardDAV) e utilizza record DNS SRV.

Forward Email pubblica i record di autodiscovery su `forwardemail.net`. Puoi aggiungere i record SRV direttamente al tuo dominio, oppure usare un approccio più semplice con CNAME.

#### Opzione A: record CNAME (più semplice) {#option-a-cname-records-simplest}

Aggiungi questi due record CNAME al DNS del tuo dominio. Questo delega l'autodiscovery ai server di Forward Email:

|  Tipo | Nome/Host      | Destinazione/Valore             |
| :---: | -------------- | ------------------------------- |
| CNAME | `autoconfig`   | `autoconfig.forwardemail.net`   |
| CNAME | `autodiscover` | `autodiscover.forwardemail.net` |

Il record `autoconfig` è usato da **Thunderbird** e altri client basati su Mozilla. Il record `autodiscover` è usato da **Microsoft Outlook**.

#### Opzione B: record SRV (diretti) {#option-b-srv-records-direct}

Se preferisci aggiungere i record direttamente (o il tuo provider DNS non supporta CNAME su sottodomini), aggiungi questi record SRV al tuo dominio:

| Tipo | Nome/Host           | Priorità | Peso | Porta | Destinazione/Valore         | Scopo                                  |
| :--: | ------------------- | :------: | :--: | :---: | --------------------------- | ------------------------------------- |
|  SRV | `_imaps._tcp`       |     0    |  1   |  993  | `imap.forwardemail.net`     | IMAP su SSL/TLS (preferito)           |
|  SRV | `_imap._tcp`        |     0    |  0   |   0   | `.`                         | IMAP in chiaro disabilitato           |
|  SRV | `_submissions._tcp` |     0    |  1   |  465  | `smtp.forwardemail.net`     | Invio SMTP (SSL/TLS, raccomandato)   |
|  SRV | `_submission._tcp`  |     5    |  1   |  587  | `smtp.forwardemail.net`     | Invio SMTP (STARTTLS)                  |
|  SRV | `_pop3s._tcp`       |    10    |  1   |  995  | `pop3.forwardemail.net`     | POP3 su SSL/TLS                       |
|  SRV | `_pop3._tcp`        |     0    |  0   |   0   | `.`                         | POP3 in chiaro disabilitato           |
|  SRV | `_caldavs._tcp`     |     0    |  1   |  443  | `caldav.forwardemail.net`   | CalDAV su TLS (calendari)             |
|  SRV | `_caldav._tcp`      |     0    |  0   |   0   | `.`                         | CalDAV in chiaro disabilitato         |
|  SRV | `_carddavs._tcp`    |     0    |  1   |  443  | `carddav.forwardemail.net`  | CardDAV su TLS (contatti)             |
|  SRV | `_carddav._tcp`     |     0    |  0   |   0   | `.`                         | CardDAV in chiaro disabilitato        |
> \[!NOTE]
> IMAP ha un valore di priorità inferiore (0) rispetto a POP3 (10), il che indica ai client di posta di preferire IMAP rispetto a POP3 quando entrambi sono disponibili. I record con un target `.` (un singolo punto) indicano che le versioni in chiaro (non criptate) di quei protocolli sono intenzionalmente disabilitate secondo [RFC 6186 Sezione 3.4](https://www.rfc-editor.org/rfc/rfc6186.html#section-3.4). I record SRV CalDAV e CardDAV seguono [RFC 6764](https://www.rfc-editor.org/rfc/rfc6764.html) per l'autodiscovery di calendario e contatti.

#### Quali client di posta supportano l'autodiscovery? {#which-email-clients-support-autodiscovery}

| Client             | Email                                            | CalDAV/CardDAV                             |
| ------------------ | ------------------------------------------------ | ------------------------------------------ |
| Thunderbird        | record CNAME o SRV `autoconfig`                   | record XML `autoconfig` o SRV (RFC 6764)   |
| Apple Mail (macOS) | record SRV (RFC 6186)                             | record SRV (RFC 6764)                      |
| Apple Mail (iOS)   | record SRV (RFC 6186)                             | record SRV (RFC 6764)                      |
| Microsoft Outlook  | record CNAME `autodiscover` o SRV `_autodiscover._tcp` | Non supportato                            |
| GNOME (Evolution)  | record SRV (RFC 6186)                             | record SRV (RFC 6764)                      |
| KDE (KMail)        | record SRV (RFC 6186)                             | record SRV (RFC 6764)                      |
| eM Client          | `autoconfig` o `autodiscover`                     | record SRV (RFC 6764)                      |

> \[!TIP]
> Per la migliore compatibilità tra tutti i client, consigliamo di usare **Opzione A** (record CNAME) combinata con i record SRV di **Opzione B**. L'approccio CNAME da solo copre la maggior parte dei client di posta. I record SRV CalDAV/CardDAV garantiscono che i client di calendario e contatti possano anche scoprire automaticamente le impostazioni del server.


## Sicurezza {#security-1}

### Tecniche avanzate di rafforzamento del server {#advanced-server-hardening-techniques}

> \[!TIP]
> Scopri di più sulla nostra infrastruttura di sicurezza nella [nostra pagina Sicurezza](/security).

Forward Email implementa numerose tecniche di rafforzamento del server per garantire la sicurezza della nostra infrastruttura e dei tuoi dati:

1. **Sicurezza di rete**:
   * Firewall con regole rigide basato su IP tables
   * Fail2ban per la protezione da attacchi brute force
   * Audit di sicurezza regolari e penetration testing
   * Accesso amministrativo solo tramite VPN

2. **Rafforzamento del sistema**:
   * Installazione minima di pacchetti
   * Aggiornamenti di sicurezza regolari
   * SELinux in modalità enforcing
   * Accesso SSH root disabilitato
   * Autenticazione solo tramite chiave

3. **Sicurezza dell'applicazione**:
   * Header Content Security Policy (CSP)
   * HTTPS Strict Transport Security (HSTS)
   * Header di protezione XSS
   * Header per opzioni frame e politica referrer
   * Audit regolari delle dipendenze

4. **Protezione dei dati**:
   * Crittografia completa del disco con LUKS
   * Gestione sicura delle chiavi
   * Backup regolari con crittografia
   * Pratiche di minimizzazione dei dati

5. **Monitoraggio e risposta**:
   * Rilevamento intrusioni in tempo reale
   * Scansioni di sicurezza automatizzate
   * Logging e analisi centralizzati
   * Procedure di risposta agli incidenti

> \[!IMPORTANT]
> Le nostre pratiche di sicurezza sono continuamente aggiornate per affrontare minacce e vulnerabilità emergenti.

> \[!TIP]
> Per la massima sicurezza, consigliamo di usare il nostro servizio con crittografia end-to-end tramite OpenPGP.

### Avete certificazioni SOC 2 o ISO 27001 {#do-you-have-soc-2-or-iso-27001-certifications}

> \[!NOTE]
> Forward Email opera su infrastruttura fornita da subprocessori certificati per garantire la conformità agli standard di settore.

Forward Email non possiede direttamente certificazioni SOC 2 Tipo II o ISO 27001. Tuttavia, il servizio opera su infrastruttura fornita da subprocessori certificati:

* **DigitalOcean**: certificata SOC 2 Tipo II e SOC 3 Tipo II (auditata da Schellman & Company LLC), certificata ISO 27001 in più data center. Dettagli: <https://www.digitalocean.com/trust/certification-reports>
* **Vultr**: certificato SOC 2+ (HIPAA), certificazioni ISO/IEC: 20000-1:2018, 27001:2022, 27017:2015, 27018:2019. Dettagli: <https://www.vultr.com/legal/compliance/>

* **DataPacket**: conforme SOC 2 (contattare direttamente DataPacket per ottenere la certificazione), fornitore di infrastrutture di livello enterprise (sede di Denver). Dettagli: <https://www.datapacket.com/datacenters/denver>

Forward Email segue le migliori pratiche del settore per le verifiche di sicurezza e collabora regolarmente con ricercatori di sicurezza indipendenti. Fonte: <https://forwardemail.net/technical-whitepaper.pdf#page=36>

### Usate la crittografia TLS per l’inoltro delle email {#do-you-use-tls-encryption-for-email-forwarding}

Sì. Forward Email applica rigorosamente TLS 1.2+ per tutte le connessioni (HTTPS, SMTP, IMAP, POP3) e implementa MTA-STS per un supporto TLS avanzato. L’implementazione include:

* Applicazione di TLS 1.2+ per tutte le connessioni email
* Scambio di chiavi ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) per perfect forward secrecy
* Suite di cifratura moderne con aggiornamenti di sicurezza regolari
* Supporto HTTP/2 per migliorare prestazioni e sicurezza
* HSTS (HTTP Strict Transport Security) con preloading nei principali browser
* **MTA-STS (Mail Transfer Agent Strict Transport Security)** per un’applicazione rigorosa di TLS

Fonte: <https://forwardemail.net/technical-whitepaper.pdf#page=25>

**Implementazione MTA-STS**: Forward Email applica un’applicazione rigorosa di MTA-STS nel codice. Quando si verificano errori TLS e MTA-STS è attivo, il sistema restituisce codici di stato SMTP 421 per garantire che le email vengano ritentate in seguito anziché consegnate in modo non sicuro. Dettagli dell’implementazione:

* Rilevamento errori TLS: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-tls-error.js>
* Applicazione MTA-STS nel helper send-email: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/send-email.js>

Validazione di terze parti: <https://www.hardenize.com/report/forwardemail.net/1750312779> mostra valutazioni "Good" per tutte le misure di sicurezza TLS e di trasporto.

### Conservate le intestazioni di autenticazione email {#do-you-preserve-email-authentication-headers}

Sì. Forward Email implementa e conserva in modo completo le intestazioni di autenticazione email:

* **SPF (Sender Policy Framework)**: correttamente implementato e conservato
* **DKIM (DomainKeys Identified Mail)**: pieno supporto con gestione corretta delle chiavi
* **DMARC**: applicazione della policy per email che non superano la validazione SPF o DKIM
* **ARC**: sebbene non dettagliato esplicitamente, i punteggi di conformità perfetti del servizio suggeriscono una gestione completa delle intestazioni di autenticazione

Fonte: <https://forwardemail.net/technical-whitepaper.pdf#page=31>

Validazione: il test Mail di Internet.nl mostra un punteggio di 100/100 specificamente per l’implementazione di "SPF, DKIM e DMARC". La valutazione Hardenize conferma valutazioni "Good" per SPF e DMARC: <https://www.hardenize.com/report/forwardemail.net/1750312779>

### Conservate le intestazioni originali delle email e prevenite lo spoofing {#do-you-preserve-original-email-headers-and-prevent-spoofing}

> \[!TIP]
> Forward Email implementa una protezione anti-spoofing sofisticata per prevenire abusi email.

Forward Email conserva le intestazioni originali delle email implementando una protezione anti-spoofing completa tramite il codice MX:

* **Conservazione delle intestazioni**: le intestazioni di autenticazione originali sono mantenute durante l’inoltro
* **Anti-Spoofing**: l’applicazione della policy DMARC impedisce lo spoofing delle intestazioni rifiutando email che non superano la validazione SPF o DKIM
* **Prevenzione dell’iniezione di intestazioni**: validazione e sanificazione degli input usando la libreria striptags
* **Protezione avanzata**: rilevamento sofisticato di phishing con individuazione di spoofing, prevenzione di impersonificazione e sistemi di notifica agli utenti

**Dettagli implementazione MX**: la logica principale di elaborazione email è gestita dal codice del server MX, nello specifico:

* Gestore principale dati MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>
* Filtraggio email arbitrario (anti-spoofing): <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-arbitrary.js>

L’helper `isArbitrary` implementa regole anti-spoofing sofisticate inclusa la rilevazione di impersonificazione di dominio, frasi bloccate e vari schemi di phishing.
### Come ti proteggi contro spam e abusi {#how-do-you-protect-against-spam-and-abuse}

Forward Email implementa una protezione multilivello completa:

* **Limitazione della frequenza**: Applicata ai tentativi di autenticazione, agli endpoint API e alle connessioni SMTP
* **Isolamento delle risorse**: Tra gli utenti per prevenire impatti da utenti ad alto volume
* **Protezione DDoS**: Protezione multilivello tramite il sistema Shield di DataPacket e Cloudflare
* **Scalabilità automatica**: Regolazione dinamica delle risorse in base alla domanda
* **Prevenzione degli abusi**: Controlli specifici per utente e blocco basato su hash per contenuti dannosi
* **Autenticazione email**: Protocolli SPF, DKIM, DMARC con rilevamento avanzato di phishing

Fonti:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver> (dettagli sulla protezione DDoS)
* <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/abuse-prevention-by-user-id.js>

### Conservate il contenuto delle email su disco {#do-you-store-email-content-on-disk}

> \[!IMPORTANT]
> Forward Email utilizza un'architettura zero-knowledge che impedisce che il contenuto delle email venga scritto su disco.

* **Architettura Zero-Knowledge**: Caselle di posta SQLite criptate individualmente significano che Forward Email non può accedere al contenuto delle email
* **Elaborazione in memoria**: L'elaborazione delle email avviene interamente in memoria, evitando la memorizzazione su disco
* **Nessun log del contenuto**: "Non registriamo né memorizziamo contenuti o metadata delle email su disco"
* **Crittografia in sandbox**: Le chiavi di crittografia non sono mai memorizzate in chiaro su disco

**Prova nel codice MX**: Il server MX elabora le email interamente in memoria senza scrivere contenuti su disco. Il gestore principale dell'elaborazione email dimostra questo approccio in memoria: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Fonti:

* <https://forwardemail.net/technical-whitepaper.pdf#page=10> (Abstract)
* <https://forwardemail.net/technical-whitepaper.pdf#page=59> (Dettagli zero-knowledge)
* <https://forwardemail.net/technical-whitepaper.pdf#page=21> (Crittografia in sandbox)

### Il contenuto delle email può essere esposto durante crash di sistema {#can-email-content-be-exposed-during-system-crashes}

No. Forward Email implementa salvaguardie complete contro l'esposizione di dati dovuta a crash:

* **Core dump disabilitati**: Previene l'esposizione della memoria durante i crash
* **Memoria swap disabilitata**: Completamente disabilitata per evitare l'estrazione di dati sensibili dai file di swap
* **Architettura in memoria**: Il contenuto delle email esiste solo in memoria volatile durante l'elaborazione
* **Protezione delle chiavi di crittografia**: Le chiavi non sono mai memorizzate in chiaro su disco
* **Sicurezza fisica**: Dischi criptati LUKS v2 impediscono l'accesso fisico ai dati
* **Archiviazione USB disabilitata**: Previene l'estrazione non autorizzata di dati

**Gestione degli errori per problemi di sistema**: Forward Email utilizza le funzioni helper `isCodeBug` e `isTimeoutError` per garantire che in caso di problemi di connettività al database, problemi di rete DNS/blocchi o problemi di connettività a monte, il sistema restituisca codici di stato SMTP 421 per assicurare che le email vengano ritentate più tardi anziché perse o esposte.

Dettagli di implementazione:

* Classificazione degli errori: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js>
* Gestione degli errori di timeout nell'elaborazione MX: <https://github.com/forwardemail/forwardemail.net/blob/master/helpers/on-data-mx.js>

Fonte: <https://forwardemail.net/technical-whitepaper.pdf#page=15>

### Chi ha accesso alla tua infrastruttura email {#who-has-access-to-your-email-infrastructure}

Forward Email implementa controlli di accesso completi per il suo team di ingegneri minimo di 2-3 persone con rigorosi requisiti di 2FA:

* **Controllo degli accessi basato sui ruoli**: Per gli account del team con permessi basati sulle risorse
* **Principio del minimo privilegio**: Applicato in tutti i sistemi
* **Separazione dei compiti**: Tra i ruoli operativi
* **Gestione utenti**: Utenti separati per deploy e devops con permessi distinti
* **Login root disabilitato**: Forza l'accesso tramite account autenticati correttamente
* **2FA rigorosa**: Nessun 2FA via SMS a causa del rischio di attacchi MiTM - solo app o token hardware
* **Audit logging completo**: Con redazione dei dati sensibili
* **Rilevamento automatico delle anomalie**: Per pattern di accesso insoliti
* **Revisioni di sicurezza regolari**: Dei log di accesso
* **Prevenzione attacchi Evil Maid**: Archiviazione USB disabilitata e altre misure di sicurezza fisica
Fonti:

* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Controlli di Autorizzazione)
* <https://forwardemail.net/technical-whitepaper.pdf#page=30> (Sicurezza della Rete)
* <https://forwardemail.net/technical-whitepaper.pdf#page=15> (Prevenzione attacchi evil maid)

### Quali fornitori di infrastruttura utilizzate {#what-infrastructure-providers-do-you-use}

> \[!IMPORTANT]
> Forward Email utilizza molteplici subprocessori di infrastruttura con certificazioni di conformità complete.

Dettagli completi sono disponibili sulla nostra pagina di conformità GDPR: <https://forwardemail.net/gdpr>

**Principali Subprocessori di Infrastruttura:**

| Fornitore       | Certificato Data Privacy Framework | Pagina di Conformità GDPR                                                               |
| --------------- | --------------------------------- | --------------------------------------------------------------------------------------- |
| **Cloudflare**  | ✅ Sì                             | <https://www.cloudflare.com/trust-hub/gdpr/>                                           |
| **DataPacket**  | ❌ No                             | <https://www.datapacket.com/privacy-policy>                                            |
| **DigitalOcean**| ❌ No                             | <https://www.digitalocean.com/legal/gdpr>                                              |
| **GitHub**      | ✅ Sì                             | <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement> |
| **Vultr**       | ❌ No                             | <https://www.vultr.com/legal/eea-gdpr-privacy/>                                        |

**Certificazioni Dettagliate:**

**DigitalOcean**

* SOC 2 Tipo II & SOC 3 Tipo II (auditato da Schellman & Company LLC)
* Certificato ISO 27001 in più data center
* Conforme PCI-DSS
* Certificato CSA STAR Livello 1
* Certificato APEC CBPR PRP
* Dettagli: <https://www.digitalocean.com/trust/certification-reports>

**Vultr**

* Certificato SOC 2+ (HIPAA)
* Conforme PCI Merchant
* Certificato CSA STAR Livello 1
* ISO/IEC 20000-1:2018, 27001:2022, 27017:2015, 27018:2019
* Dettagli: <https://www.vultr.com/legal/compliance/>

**DataPacket**

* Conforme SOC 2 (contattare direttamente DataPacket per ottenere la certificazione)
* Infrastruttura di livello enterprise (sede a Denver)
* Protezione DDoS tramite stack di cybersecurity Shield
* Supporto tecnico 24/7
* Rete globale con 58 data center
* Dettagli: <https://www.datapacket.com/datacenters/denver>

**GitHub**

* Certificato Data Privacy Framework (EU-U.S., Swiss-U.S., e UK Extension)
* Hosting codice sorgente, CI/CD e gestione progetti
* Disponibile Accordo di Protezione dei Dati GitHub
* Dettagli: <https://docs.github.com/en/site-policy/privacy-policies/github-data-protection-agreement>

**Processori di Pagamento:**

* **Stripe**: Certificato Data Privacy Framework - <https://stripe.com/legal/privacy-center>
* **PayPal**: Non certificato DPF - <https://www.paypal.com/uk/legalhub/privacy-full>

### Offrite un Accordo sul Trattamento dei Dati (DPA) {#do-you-offer-a-data-processing-agreement-dpa}

Sì, Forward Email offre un completo Accordo sul Trattamento dei Dati (DPA) che può essere firmato con il nostro accordo enterprise. Una copia del nostro DPA è disponibile su: <https://forwardemail.net/dpa>

**Dettagli DPA:**

* Copre la conformità GDPR e i framework EU-US/Swiss-US Privacy Shield
* Accettato automaticamente con l’accettazione dei nostri Termini di Servizio
* Nessuna firma separata richiesta per il DPA standard
* Accordi DPA personalizzati disponibili tramite Licenza Enterprise

**Framework di Conformità GDPR:**
Il nostro DPA dettaglia la conformità al GDPR così come i requisiti per il trasferimento internazionale dei dati. Informazioni complete sono disponibili su: <https://forwardemail.net/gdpr>

Per clienti enterprise che necessitano di termini DPA personalizzati o accordi contrattuali specifici, questi possono essere gestiti tramite il nostro programma **Enterprise License ($250/mese)**.

### Come gestite le notifiche di violazione dei dati {#how-do-you-handle-data-breach-notifications}

> \[!NOTE]
> L’architettura zero-knowledge di Forward Email limita significativamente l’impatto delle violazioni.
* **Esposizione Limitata dei Dati**: Impossibile accedere al contenuto delle email criptate grazie all'architettura a conoscenza zero
* **Raccolta Minima dei Dati**: Solo informazioni di base sugli abbonati e registri IP limitati per la sicurezza
* **Framework dei Subprocessori**: DigitalOcean, GitHub e Vultr mantengono procedure di risposta agli incidenti conformi al GDPR

**Informazioni sul Rappresentante GDPR:**
Forward Email ha nominato rappresentanti GDPR in conformità all'Articolo 27:

**Rappresentante UE:**
Osano International Compliance Services Limited
ATTN: LFHC
3 Dublin Landings, North Wall Quay
Dublino 1, D01C4E0

**Rappresentante UK:**
Osano UK Compliance LTD
ATTN: LFHC
42-46 Fountain Street, Belfast
Antrim, BT1 - 5EF

Per i clienti enterprise che richiedono SLA specifici per la notifica delle violazioni, questi dovrebbero essere discussi come parte di un accordo di **Enterprise License**.

Fonti:

* <https://forwardemail.net/technical-whitepaper.pdf#page=59>
* <https://forwardemail.net/gdpr>

### Offrite un ambiente di test {#do-you-offer-a-test-environment}

La documentazione tecnica di Forward Email non descrive esplicitamente una modalità sandbox dedicata. Tuttavia, i possibili approcci di test includono:

* **Opzione Self-Hosting**: Capacità complete di self-hosting per creare ambienti di test
* **Interfaccia API**: Potenziale per test programmatici delle configurazioni
* **Open Source**: Codice 100% open source che permette ai clienti di esaminare la logica di inoltro
* **Molteplici Domini**: Supporto per più domini che potrebbe consentire la creazione di domini di test

Per i clienti enterprise che richiedono capacità formali di sandbox, questo dovrebbe essere discusso come parte di un accordo di **Enterprise License**.

Fonte: <https://github.com/forwardemail/forwardemail.net> (Dettagli ambiente di sviluppo)

### Fornite strumenti di monitoraggio e allerta {#do-you-provide-monitoring-and-alerting-tools}

Forward Email fornisce monitoraggio in tempo reale con alcune limitazioni:

**Disponibili:**

* **Monitoraggio della Consegna in Tempo Reale**: Metriche di performance visibili pubblicamente per i principali provider email
* **Allerta Automatica**: Il team di ingegneria viene allertato quando i tempi di consegna superano i 10 secondi
* **Monitoraggio Trasparente**: Sistemi di monitoraggio 100% open source
* **Monitoraggio dell'Infrastruttura**: Rilevamento automatico delle anomalie e logging completo degli audit

**Limitazioni:**

* Webhook rivolti ai clienti o notifiche di stato di consegna basate su API non sono documentati esplicitamente

Per i clienti enterprise che richiedono webhook dettagliati sullo stato di consegna o integrazioni di monitoraggio personalizzate, queste capacità potrebbero essere disponibili tramite accordi di **Enterprise License**.

Fonti:

* <https://forwardemail.net> (Visualizzazione monitoraggio in tempo reale)
* <https://github.com/forwardemail/forwardemail.net> (Implementazione monitoraggio)

### Come garantite alta disponibilità {#how-do-you-ensure-high-availability}

> \[!IMPORTANT]
> Forward Email implementa una ridondanza completa attraverso molteplici fornitori di infrastruttura.

* **Infrastruttura Distribuita**: Molteplici fornitori (DigitalOcean, Vultr, DataPacket) in diverse regioni geografiche
* **Bilanciamento del Carico Geografico**: Bilanciamento del carico geo-localizzato basato su Cloudflare con failover automatico
* **Scalabilità Automatica**: Regolazione dinamica delle risorse in base alla domanda
* **Protezione DDoS Multistrato**: Attraverso il sistema Shield di DataPacket e Cloudflare
* **Ridondanza dei Server**: Molteplici server per regione con failover automatico
* **Replica del Database**: Sincronizzazione dati in tempo reale tra più sedi
* **Monitoraggio e Allerta**: Monitoraggio 24/7 con risposta automatica agli incidenti

**Impegno di Uptime**: Disponibilità del servizio superiore al 99,9% con monitoraggio trasparente disponibile su <https://forwardemail.net>

Fonti:

* <https://forwardemail.net/technical-whitepaper.pdf#page=18>
* <https://www.datapacket.com/datacenters/denver>

### Siete conformi alla Sezione 889 del National Defense Authorization Act (NDAA) {#are-you-compliant-with-section-889-of-the-national-defense-authorization-act-ndaa}

> \[!IMPORTANT]
> Forward Email è pienamente conforme alla Sezione 889 grazie a una selezione accurata dei partner infrastrutturali.

Sì, Forward Email è **conforme alla Sezione 889**. La Sezione 889 del National Defense Authorization Act (NDAA) vieta alle agenzie governative di utilizzare o contrattare con entità che utilizzano apparecchiature di telecomunicazioni e videosorveglianza di specifiche aziende (Huawei, ZTE, Hikvision, Dahua e Hytera).
**Come Forward Email Raggiunge la Conformità alla Sezione 889:**

Forward Email si affida esclusivamente a due fornitori chiave di infrastruttura, nessuno dei quali utilizza apparecchiature proibite dalla Sezione 889:

1. **Cloudflare**: Il nostro partner principale per i servizi di rete e la sicurezza email
2. **DataPacket**: Il nostro fornitore principale per l'infrastruttura server (utilizzando esclusivamente apparecchiature Arista Networks e Cisco)
3. **Fornitori di Backup**: I nostri fornitori di backup Digital Ocean e Vultr sono inoltre confermati per iscritto come conformi alla Sezione 889.

**Impegno di Cloudflare**: Cloudflare dichiara esplicitamente nel loro Codice di Condotta per Terze Parti che non utilizzano apparecchiature di telecomunicazione, prodotti di videosorveglianza o servizi da entità proibite dalla Sezione 889.

**Caso d'Uso Governativo**: La nostra conformità alla Sezione 889 è stata validata quando la **US Naval Academy** ha scelto Forward Email per le loro esigenze di inoltro email sicuro, richiedendo la documentazione dei nostri standard di conformità federale.

Per dettagli completi sul nostro quadro di conformità governativa, incluse normative federali più ampie, leggi il nostro studio di caso completo: [Servizio Email del Governo Federale Conforme alla Sezione 889](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)


## Dettagli di Sistema e Tecnici {#system-and-technical-details}

### Conservate le email e i loro contenuti {#do-you-store-emails-and-their-contents}

No, non scriviamo su disco né conserviamo log – con [l'eccezione degli errori](#do-you-store-error-logs) e [SMTP in uscita](#do-you-support-sending-email-with-smtp) (vedi la nostra [Privacy Policy](/privacy)).

Tutto viene fatto in memoria e [il nostro codice sorgente è su GitHub](https://github.com/forwardemail).

### Come funziona il vostro sistema di inoltro email {#how-does-your-email-forwarding-system-work}

L'email si basa sul [protocollo SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). Questo protocollo consiste in comandi inviati a un server (che generalmente opera sulla porta 25). C'è una connessione iniziale, poi il mittente indica da chi proviene la mail ("MAIL FROM"), seguito da dove è destinata ("RCPT TO"), e infine gli header e il corpo dell'email stessa ("DATA"). Il flusso del nostro sistema di inoltro email è descritto in relazione a ciascun comando del protocollo SMTP qui sotto:

* Connessione Iniziale (nessun nome comando, es. `telnet example.com 25`) - Questa è la connessione iniziale. Controlliamo i mittenti che non sono nella nostra [allowlist](#do-you-have-an-allowlist) rispetto alla nostra [denylist](#do-you-have-a-denylist). Infine, se un mittente non è nella nostra allowlist, verifichiamo se è stato [greylistato](#do-you-have-a-greylist).

* `HELO` - Questo indica un saluto per identificare il FQDN del mittente, l'indirizzo IP o il nome del gestore della posta. Questo valore può essere falsificato, quindi non ci affidiamo a questi dati ma usiamo invece la ricerca inversa del nome host dell'indirizzo IP della connessione.

* `MAIL FROM` - Questo indica l'indirizzo mail di provenienza della busta dell'email. Se viene inserito un valore, deve essere un indirizzo email valido secondo RFC 5322. Sono permessi valori vuoti. Qui [controlliamo il backscatter](#how-do-you-protect-against-backscatter) e verifichiamo anche il MAIL FROM rispetto alla nostra [denylist](#do-you-have-a-denylist). Infine controlliamo i mittenti non presenti nella allowlist per il rate limiting (vedi la sezione su [Rate Limiting](#do-you-have-rate-limiting) e [allowlist](#do-you-have-an-allowlist) per maggiori informazioni).

* `RCPT TO` - Questo indica il/i destinatario/i dell'email. Devono essere indirizzi email validi secondo RFC 5322. Permettiamo fino a un massimo di 50 destinatari in busta per messaggio (questo è diverso dall'header "To" di un'email). Controlliamo anche la presenza di un valido indirizzo [Sender Rewriting Scheme](https://en.wikipedia.org/wiki/Sender_Rewriting_Scheme) ("SRS") qui per proteggere contro lo spoofing con il nostro nome di dominio SRS.

* `DATA` - Questa è la parte centrale del nostro servizio che elabora un'email. Vedi la sezione [Come processate un'email per l'inoltro](#how-do-you-process-an-email-for-forwarding) qui sotto per maggiori dettagli.
### Come processate un'email per l'inoltro {#how-do-you-process-an-email-for-forwarding}

Questa sezione descrive il nostro processo relativo al comando del protocollo SMTP `DATA` nella sezione [Come funziona il vostro sistema di inoltro email](#how-does-your-email-forwarding-system-work) sopra – è il modo in cui processiamo le intestazioni, il corpo, la sicurezza di un'email, determiniamo dove deve essere consegnata e come gestiamo le connessioni.

1. Se il messaggio supera la dimensione massima di 50mb, viene rifiutato con un codice di errore 552.

2. Se il messaggio non contiene un'intestazione "From", o se uno qualsiasi dei valori nell'intestazione "From" non è un indirizzo email valido secondo RFC 5322, viene rifiutato con un codice di errore 550.

3. Se il messaggio ha più di 25 intestazioni "Received", si determina che è rimasto bloccato in un ciclo di reindirizzamento, e viene rifiutato con un codice di errore 550.

4. Utilizzando l'impronta digitale dell'email (vedi la sezione su [Fingerprinting](#how-do-you-determine-an-email-fingerprint)), verifichiamo se il messaggio è stato tentato di essere ritentato per più di 5 giorni (corrispondente al [comportamento predefinito di postfix](http://www.postfix.org/postconf.5.html#maximal_queue_lifetime)), e in tal caso viene rifiutato con un codice di errore 550.

5. Conserviamo in memoria i risultati della scansione dell'email utilizzando [Spam Scanner](https://spamscanner.net).

6. Se ci sono stati risultati arbitrari da Spam Scanner, viene rifiutato con un codice di errore 554. I risultati arbitrari includono solo il test GTUBE al momento della scrittura. Vedi <https://spamassassin.apache.org/gtube/> per maggiori dettagli.

7. Aggiungiamo le seguenti intestazioni al messaggio per scopi di debug e prevenzione degli abusi:

   * `Received` - aggiungiamo questa intestazione standard Received con IP e host di origine, tipo di trasmissione, informazioni sulla connessione TLS, data/ora e destinatario.
   * `X-Original-To` - il destinatario originale del messaggio:
     * Questo è utile per determinare dove un'email è stata originariamente consegnata (oltre all'intestazione "Received").
     * Viene aggiunto per ogni destinatario al momento dell'IMAP e/o inoltro mascherato (per proteggere la privacy).
   * `X-Forward-Email-Website` - contiene un link al nostro sito web <https://forwardemail.net>
   * `X-Forward-Email-Version` - la versione corrente [SemVer](https://semver.org/) dal `package.json` del nostro codice.
   * `X-Forward-Email-Session-ID` - un valore ID sessione usato per scopi di debug (applica solo in ambienti non di produzione).
   * `X-Forward-Email-Sender` - una lista separata da virgole contenente l'indirizzo MAIL FROM originale della busta (se non era vuoto), il FQDN PTR inverso del client (se esiste), e l'indirizzo IP del mittente.
   * `X-Forward-Email-ID` - applicabile solo per SMTP in uscita e corrisponde all'ID email memorizzato in Il Mio Account → Email
   * `X-Report-Abuse` - con valore `abuse@forwardemail.net`.
   * `X-Report-Abuse-To` - con valore `abuse@forwardemail.net`.
   * `X-Complaints-To` - con valore `abuse@forwardemail.net`.

8. Controlliamo quindi il messaggio per [DKIM](https://en.wikipedia.org/wiki/DomainKeys_Identified_Mail), [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework), [ARC](https://en.wikipedia.org/wiki/Authenticated_Received_Chain) e [DMARC](https://en.wikipedia.org/wiki/DMARC).

   * Se il messaggio non supera DMARC e il dominio ha una politica di rifiuto (es. `p=reject` [era nella politica DMARC](https://wikipedia.org/wiki/DMARC)), viene rifiutato con un codice di errore 550. Tipicamente una politica DMARC per un dominio si trova nel record <strong class="notranslate">TXT</strong> del sottodominio `_dmarc` (es. `dig _dmarc.example.com txt`).
   * Se il messaggio non supera SPF e il dominio ha una politica di hard fail (es. `-all` era nella politica SPF invece di `~all` o nessuna politica), viene rifiutato con un codice di errore 550. Tipicamente una politica SPF per un dominio si trova nel record <strong class="notranslate">TXT</strong> del dominio root (es. `dig example.com txt`). Vedi questa sezione per maggiori informazioni su [inviare mail come con Gmail](#can-i-send-mail-as-in-gmail-with-this) riguardo SPF.
9. Ora elaboriamo i destinatari del messaggio come raccolti dal comando `RCPT TO` nella sezione [Come funziona il tuo sistema di inoltro email](#how-does-your-email-forwarding-system-work) sopra. Per ogni destinatario, eseguiamo le seguenti operazioni:

   * Cerchiamo i record <strong class="notranslate">TXT</strong> del nome di dominio (la parte dopo il simbolo `@`, ad esempio `example.com` se l'indirizzo email era `test@example.com`). Per esempio, se il dominio è `example.com` eseguiamo una ricerca DNS come `dig example.com txt`.
   * Analizziamo tutti i record <strong class="notranslate">TXT</strong> che iniziano con `forward-email=` (piani gratuiti) o `forward-email-site-verification=` (piani a pagamento). Nota che analizziamo entrambi, per poter processare le email mentre un utente sta effettuando un upgrade o downgrade del piano.
   * Da questi record <strong class="notranslate">TXT</strong> analizzati, li iteriamo per estrarre la configurazione di inoltro (come descritto nella sezione [Come iniziare e configurare l'inoltro email](#how-do-i-get-started-and-set-up-email-forwarding) sopra). Nota che supportiamo solo un valore `forward-email-site-verification=`, e se ne vengono forniti più di uno, si verificherà un errore 550 e il mittente riceverà un bounce per questo destinatario.
   * Iteriamo ricorsivamente la configurazione di inoltro estratta per determinare l'inoltro globale, l'inoltro basato su regex e tutte le altre configurazioni di inoltro supportate – che ora sono note come i nostri "Indirizzi di Inoltro".
   * Per ogni Indirizzo di Inoltro, supportiamo una ricerca ricorsiva (che avvierà questa serie di operazioni sull'indirizzo dato). Se viene trovato un match ricorsivo, il risultato padre verrà rimosso dagli Indirizzi di Inoltro e i figli aggiunti.
   * Gli Indirizzi di Inoltro vengono analizzati per unicità (poiché non vogliamo inviare duplicati a un indirizzo o generare connessioni SMTP aggiuntive non necessarie).
   * Per ogni Indirizzo di Inoltro, cerchiamo il suo nome di dominio contro il nostro endpoint API `/v1/max-forwarded-addresses` (per determinare a quanti indirizzi il dominio è autorizzato a inoltrare email per alias, ad esempio 10 per default – vedi la sezione su [limite massimo di inoltro per alias](#is-there-a-limit-on-the-number-of-email-addresses-i-can-forward-to-per-alias)). Se questo limite viene superato, si verificherà un errore 550 e il mittente riceverà un bounce per questo destinatario.
   * Cerchiamo le impostazioni del destinatario originale contro il nostro endpoint API `/v1/settings`, che supporta una ricerca per utenti a pagamento (con fallback per utenti gratuiti). Questo restituisce un oggetto di configurazione per impostazioni avanzate come `port` (Numero, es. `25`), `has_adult_content_protection` (Booleano), `has_phishing_protection` (Booleano), `has_executable_protection` (Booleano) e `has_virus_protection` (Booleano).
   * Basandoci su queste impostazioni, controlliamo i risultati dello Spam Scanner e se si verificano errori, il messaggio viene rifiutato con codice errore 554 (ad esempio, se `has_virus_protection` è abilitato, controlleremo i risultati dello Spam Scanner per virus). Nota che tutti gli utenti del piano gratuito sono automaticamente sottoposti a controlli per contenuti per adulti, phishing, eseguibili e virus. Per default, anche tutti gli utenti a pagamento sono sottoposti a questi controlli, ma questa configurazione può essere modificata nella pagina Impostazioni di un dominio nella dashboard Forward Email).

10. Per ogni Indirizzo di Inoltro del destinatario elaborato, eseguiamo quindi le seguenti operazioni:

    * L'indirizzo viene controllato contro la nostra [denylist](#do-you-have-a-denylist), e se è presente, si verificherà un errore 421 (indica al mittente di riprovare più tardi).
    * Se l'indirizzo è un webhook, impostiamo un Booleano per operazioni future (vedi sotto – raggruppiamo insieme webhook simili per fare una singola richiesta POST invece di multiple per la consegna).
    * Se l'indirizzo è un indirizzo email, analizziamo l'host per operazioni future (vedi sotto – raggruppiamo insieme host simili per fare una singola connessione invece di multiple connessioni individuali per la consegna).
11. Se non ci sono destinatari e non ci sono rimbalzi, allora rispondiamo con un errore 550 di "Destinatari non validi".

12. Se ci sono destinatari, allora li iteriamo (raggruppati insieme per lo stesso host) e consegniamo le email. Vedi la sezione [Come gestite i problemi di consegna delle email](#how-do-you-handle-email-delivery-issues) qui sotto per maggiori dettagli.

    * Se si verificano errori durante l'invio delle email, li memorizzeremo in memoria per un'elaborazione successiva.
    * Prenderemo il codice di errore più basso (se presente) dall'invio delle email – e lo useremo come codice di risposta al comando `DATA`. Questo significa che le email non consegnate saranno tipicamente ritentate dal mittente originale, mentre le email già consegnate non saranno reinviate la prossima volta che il messaggio viene inviato (poiché usiamo il [Fingerprinting](#how-do-you-determine-an-email-fingerprint)).
    * Se non si sono verificati errori, invieremo un codice di stato SMTP 250 di successo.
    * Un rimbalzo è determinato da qualsiasi tentativo di consegna che risulta in un codice di stato >= 500 (errori permanenti).

13. Se non si sono verificati rimbalzi (errori permanenti), allora restituiremo un codice di stato SMTP del codice di errore più basso tra gli errori non permanenti (o un codice di stato 250 di successo se non ce ne sono stati).

14. Se si sono verificati rimbalzi, invieremo le email di rimbalzo in background dopo aver restituito il codice di errore più basso di tutti al mittente. Tuttavia, se il codice di errore più basso è >= 500, non invieremo alcuna email di rimbalzo. Questo perché, se lo facessimo, i mittenti riceverebbero una doppia email di rimbalzo (ad esempio una dal loro MTA in uscita, come Gmail – e anche una da noi). Vedi la sezione su [Come proteggersi dal backscatter](#how-do-you-protect-against-backscatter) qui sotto per maggiori dettagli.

### Come gestite i problemi di consegna delle email {#how-do-you-handle-email-delivery-issues}

Nota che effettuiamo una riscrittura "Friendly-From" sulle email solo se la policy DMARC del mittente non è stata superata E nessuna firma DKIM era allineata con l'intestazione "From". Questo significa che modifichiamo l'intestazione "From" del messaggio, impostiamo "X-Original-From" e impostiamo anche un "Reply-To" se non era già presente. Resealiamo inoltre il sigillo ARC sul messaggio dopo aver modificato queste intestazioni.

Utilizziamo anche un parsing intelligente dei messaggi di errore a ogni livello della nostra stack – nel nostro codice, nelle richieste DNS, nelle internals di Node.js, nelle richieste HTTP (ad esempio 408, 413 e 429 sono mappati al codice di risposta SMTP 421 se il destinatario è un webhook), e nelle risposte del server di posta (ad esempio risposte con "defer" o "slowdown" saranno ritentate come errori 421).

La nostra logica è a prova di errore e ritenterà anche per errori SSL/TLS, problemi di connessione e altro. L'obiettivo della protezione a prova di errore è massimizzare la consegna a tutti i destinatari per una configurazione di inoltro.

Se il destinatario è un webhook, permettiamo un timeout di 60 secondi per completare la richiesta con fino a 3 tentativi (quindi 4 richieste totali prima di un fallimento). Nota che analizziamo correttamente i codici di errore 408, 413 e 429 e li mappiamo a un codice di risposta SMTP 421.

Altrimenti, se il destinatario è un indirizzo email, tenteremo di inviare l'email con TLS opportunistico (tentiamo di usare STARTTLS se disponibile sul server di posta del destinatario). Se si verifica un errore SSL/TLS durante il tentativo di invio, tenteremo di inviare l'email senza TLS (senza usare STARTTLS).

Se si verificano errori DNS o di connessione, restituiremo al comando `DATA` un codice di risposta SMTP 421, altrimenti se ci sono errori di livello >= 500, verranno inviati i rimbalzi.

Se rileviamo che un server di posta a cui stiamo tentando di consegnare ha bloccato uno o più dei nostri indirizzi IP di scambio mail (ad esempio tramite qualsiasi tecnologia usino per differire gli spammer), invieremo un codice di risposta SMTP 421 affinché il mittente ritenti il messaggio più tardi (e siamo avvisati del problema così da poterlo risolvere prima del prossimo tentativo).

### Come gestite il blocco dei vostri indirizzi IP {#how-do-you-handle-your-ip-addresses-becoming-blocked}
Monitoriamo regolarmente tutte le principali liste di rifiuto DNS e se uno qualsiasi dei nostri indirizzi IP di scambio di posta ("MX") è elencato in una lista di rifiuto importante, lo rimuoveremo dal relativo record DNS A round robin, se possibile, fino a quando il problema non sarà risolto.

Al momento della stesura di questo documento, siamo elencati anche in diverse liste di permessi DNS e prendiamo seriamente il monitoraggio delle liste di rifiuto. Se notate problemi prima che abbiamo la possibilità di risolverli, vi preghiamo di informarci per iscritto all'indirizzo <support@forwardemail.net>.

I nostri indirizzi IP sono pubblicamente disponibili, [vedi questa sezione qui sotto per maggiori dettagli](#what-are-your-servers-ip-addresses).

### Cosa sono gli indirizzi postmaster {#what-are-postmaster-addresses}

Per prevenire rimbalzi errati e l'invio di messaggi di risposta automatica a caselle di posta non monitorate o inesistenti, manteniamo una lista di nomi utente simili a mailer-daemon:

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
* [e qualsiasi indirizzo no-reply](#what-are-no-reply-addresses)

Consulta [RFC 5320 Sezione 4.6](https://datatracker.ietf.org/doc/html/rfc5230#section-4.6) per maggiori informazioni su come liste come queste vengono utilizzate per creare sistemi email efficienti.

### Cosa sono gli indirizzi no-reply {#what-are-no-reply-addresses}

I nomi utente email corrispondenti a uno qualsiasi dei seguenti (case-insensitive) sono considerati indirizzi no-reply:

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

Questa lista è mantenuta [come progetto open-source su GitHub](https://github.com/forwardemail/reserved-email-addresses-list).

### Quali sono gli indirizzi IP dei vostri server {#what-are-your-servers-ip-addresses}

Pubblicizziamo i nostri indirizzi IP su <https://forwardemail.net/ips>.

### Avete una lista di permessi (allowlist) {#do-you-have-an-allowlist}

Sì, abbiamo una [lista di estensioni di nomi di dominio](#what-domain-name-extensions-are-allowlisted-by-default) che sono di default nella allowlist e una allowlist dinamica, memorizzata nella cache e rotante basata su [criteri rigorosi](#what-is-your-allowlist-criteria).

Tutti i domini, le email e gli indirizzi IP utilizzati dai clienti paganti vengono automaticamente controllati ogni ora contro la nostra denylist – che avvisa gli amministratori che possono intervenire manualmente se necessario.

Inoltre, se uno dei vostri domini o i suoi indirizzi email risultano nella denylist (ad esempio per invio di spam, virus o a causa di attacchi di impersonificazione) – allora gli amministratori del dominio (voi) e i nostri amministratori di sistema saranno immediatamente notificati via email. Raccomandiamo vivamente di [configurare DMARC](#how-do-i-set-up-dmarc-for-forward-email) per prevenire ciò.

### Quali estensioni di nomi di dominio sono di default nella allowlist {#what-domain-name-extensions-are-allowlisted-by-default}

Le seguenti estensioni di nomi di dominio sono considerate di default nella allowlist (indipendentemente dal fatto che siano o meno nella Umbrella Popularity List):

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
Inoltre questi [domini di primo livello di marca e aziendali](https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains#Brand_and_corporate_top-level_domains) sono consentiti di default (ad esempio `apple` per `applecard.apple` per gli estratti conto della Apple Card):

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
  <li class="list-inline-item"><code class="notranslate">airbus</code></li>
  <li class="list-inline-item"><code class="notranslate">airtel</code></li>
  <li class="list-inline-item"><code class="notranslate">akdn</code></li>
  <li class="list-inline-item"><code class="notranslate">alfaromeo</code></li>
  <li class="list-inline-item"><code class="notranslate">alibaba</code></li>
  <li class="list-inline-item"><code class="notranslate">alipay</code></li>
  <li class="list-inline-item"><code class="notranslate">allfinanz</code></li>
  <li class="list-inline-item"><code class="notranslate">allstate</code></li>
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
  <li class="list-inline-item"><code class="notranslate">aquarelle</code></li>
  <li class="list-inline-item"><code class="notranslate">aramco</code></li>
  <li class="list-inline-item"><code class="notranslate">audi</code></li>
  <li class="list-inline-item"><code class="notranslate">auspost</code></li>
  <li class="list-inline-item"><code class="notranslate">aws</code></li>
  <li class="list-inline-item"><code class="notranslate">axa</code></li>
  <li class="list-inline-item"><code class="notranslate">azure</code></li>
  <li class="list-inline-item"><code class="notranslate">baidu</code></li>
  <li class="list-inline-item"><code class="notranslate">bananarepublic</code></li>
  <li class="list-inline-item"><code class="notranslate">barclaycard</code></li>
  <li class="list-inline-item"><code class="notranslate">barclays</code></li>
  <li class="list-inline-item"><code class="notranslate">basketball</code></li>
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
  <!--<li class="list-inline-item"><code class="notranslate">bond</code></li>-->
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
  <li class="list-inline-item"><code class="notranslate">citadel</code></li>
  <li class="list-inline-item"><code class="notranslate">citi</code></li>
  <li class="list-inline-item"><code class="notranslate">citic</code></li>
  <li class="list-inline-item"><code class="notranslate">clubmed</code></li>
  <li class="list-inline-item"><code class="notranslate">comcast</code></li>
  <li class="list-inline-item"><code class="notranslate">commbank</code></li>
  <li class="list-inline-item"><code class="notranslate">creditunion</code></li>
  <li class="list-inline-item"><code class="notranslate">crown</code></li>
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
  <li class="list-inline-item"><code class="notranslate">eurovision</code></li>
  <li class="list-inline-item"><code class="notranslate">everbank</code></li>
  <li class="list-inline-item"><code class="notranslate">extraspace</code></li>
  <li class="list-inline-item"><code class="notranslate">fage</code></li>
  <li class="list-inline-item"><code class="notranslate">fairwinds</code></li>
  <li class="list-inline-item"><code class="notranslate">farmers</code></li>
  <li class="list-inline-item"><code class="notranslate">fedex</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrari</code></li>
  <li class="list-inline-item"><code class="notranslate">ferrero</code></li>
  <li class="list-inline-item"><code class="notranslate">fiat</code></li>
  <li class="list-inline-item"><code class="notranslate">fidelity</code></li>
  <li class="list-inline-item"><code class="notranslate">firestone</code></li>
  <li class="list-inline-item"><code class="notranslate">firmdale</code></li>
  <li class="list-inline-item"><code class="notranslate">flickr</code></li>
  <li class="list-inline-item"><code class="notranslate">flir</code></li>
  <li class="list-inline-item"><code class="notranslate">flsmidth</code></li>
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
  <li class="list-inline-item"><code class="notranslate">google</code></li>
  <li class="list-inline-item"><code class="notranslate">grainger</code></li>
  <li class="list-inline-item"><code class="notranslate">guardian</code></li>
  <li class="list-inline-item"><code class="notranslate">gucci</code></li>
  <li class="list-inline-item"><code class="notranslate">hbo</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfc</code></li>
  <li class="list-inline-item"><code class="notranslate">hdfcbank</code></li>
  <li class="list-inline-item"><code class="notranslate">hermes</code></li>
  <li class="list-inline-item"><code class="notranslate">hisamitsu</code></li>
  <li class="list-inline-item"><code class="notranslate">hitachi</code></li>
  <li class="list-inline-item"><code class="notranslate">hkt</code></li>
  <li class="list-inline-item"><code class="notranslate">honda</code></li>
  <li class="list-inline-item"><code class="notranslate">honeywell</code></li>
  <li class="list-inline-item"><code class="notranslate">hotmail</code></li>
  <li class="list-inline-item"><code class="notranslate">hsbc</code></li>
  <li class="list-inline-item"><code class="notranslate">hughes</code></li>
  <li class="list-inline-item"><code class="notranslate">hyatt</code></li>
  <li class="list-inline-item"><code class="notranslate">hyundai</code></li>
  <li class="list-inline-item"><code class="notranslate">ibm</code></li>
  <li class="list-inline-item"><code class="notranslate">ieee</code></li>
  <li class="list-inline-item"><code class="notranslate">ifm</code></li>
  <li class="list-inline-item"><code class="notranslate">ikano</code></li>
  <li class="list-inline-item"><code class="notranslate">imdb</code></li>
  <li class="list-inline-item"><code class="notranslate">infiniti</code></li>
  <li class="list-inline-item"><code class="notranslate">intel</code></li>
  <li class="list-inline-item"><code class="notranslate">intuit</code></li>
  <li class="list-inline-item"><code class="notranslate">ipiranga</code></li>
  <li class="list-inline-item"><code class="notranslate">iselect</code></li>
  <li class="list-inline-item"><code class="notranslate">itau</code></li>
  <li class="list-inline-item"><code class="notranslate">itv</code></li>
  <li class="list-inline-item"><code class="notranslate">iveco</code></li>
  <li class="list-inline-item"><code class="notranslate">jaguar</code></li>
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
  <li class="list-inline-item"><code class="notranslate">lancome</code></li>
  <li class="list-inline-item"><code class="notranslate">landrover</code></li>
  <li class="list-inline-item"><code class="notranslate">lanxess</code></li>
  <li class="list-inline-item"><code class="notranslate">lasalle</code></li>
  <li class="list-inline-item"><code class="notranslate">latrobe</code></li>
  <li class="list-inline-item"><code class="notranslate">lds</code></li>
  <li class="list-inline-item"><code class="notranslate">leclerc</code></li>
  <li class="list-inline-item"><code class="notranslate">lego</code></li>
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
  <li class="list-inline-item"><code class="notranslate">mormon</code></li>
  <li class="list-inline-item"><code class="notranslate">moto</code></li>
  <li class="list-inline-item"><code class="notranslate">movistar</code></li>
  <li class="list-inline-item"><code class="notranslate">msd</code></li>
  <li class="list-inline-item"><code class="notranslate">mtn</code></li>
  <li class="list-inline-item"><code class="notranslate">mtr</code></li>
  <li class="list-inline-item"><code class="notranslate">mutual</code></li>
  <li class="list-inline-item"><code class="notranslate">nadex</code></li>
  <li class="list-inline-item"><code class="notranslate">nationwide</code></li>
  <li class="list-inline-item"><code class="notranslate">natura</code></li>
  <li class="list-inline-item"><code class="notranslate">nba</code></li>
  <li class="list-inline-item"><code class="notranslate">nec</code></li>
  <li class="list-inline-item"><code class="notranslate">netflix</code></li>
  <li class="list-inline-item"><code class="notranslate">neustar</code></li>
  <li class="list-inline-item"><code class="notranslate">newholland</code></li>
  <li class="list-inline-item"><code class="notranslate">nfl</code></li>
  <li class="list-inline-item"><code class="notranslate">nhk</code></li>
  <li class="list-inline-item"><code class="notranslate">nico</code></li>
  <li class="list-inline-item"><code class="notranslate">nike</code></li>
  <li class="list-inline-item"><code class="notranslate">nikon</code></li>
  <li class="list-inline-item"><code class="notranslate">nissan</code></li>
  <li class="list-inline-item"><code class="notranslate">nissay</code></li>
  <li class="list-inline-item"><code class="notranslate">nokia</code></li>
  <li class="list-inline-item"><code class="notranslate">northwesternmutual</code></li>
  <li class="list-inline-item"><code class="notranslate">norton</code></li>
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
  <li class="list-inline-item"><code class="notranslate">pioneer</code></li>
  <li class="list-inline-item"><code class="notranslate">play</code></li>
  <li class="list-inline-item"><code class="notranslate">playstation</code></li>
  <li class="list-inline-item"><code class="notranslate">pohl</code></li>
  <li class="list-inline-item"><code class="notranslate">politie</code></li>
  <li class="list-inline-item"><code class="notranslate">praxi</code></li>
  <li class="list-inline-item"><code class="notranslate">prod</code></li>
  <li class="list-inline-item"><code class="notranslate">progressive</code></li>
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
  <li class="list-inline-item"><code class="notranslate">safety</code></li>
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
  <li class="list-inline-item"><code class="notranslate">total</code></li>
  <li class="list-inline-item"><code class="notranslate">toyota</code></li>
  <li class="list-inline-item"><code class="notranslate">travelchannel</code></li>
  <li class="list-inline-item"><code class="notranslate">travelers</code></li>
  <li class="list-inline-item"><code class="notranslate">tui</code></li>
  <li class="list-inline-item"><code class="notranslate">tvs</code></li>
  <li class="list-inline-item"><code class="notranslate">ubs</code></li>
  <li class="list-inline-item"><code class="notranslate">unicom</code></li>
  <li class="list-inline-item"><code class="notranslate">uol</code></li>
  <li class="list-inline-item"><code class="notranslate">ups</code></li>
  <li class="list-inline-item"><code class="notranslate">vanguard</code></li>
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
A partire dal 18 marzo 2025 abbiamo anche aggiunto questi territori d'oltremare francesi a questa lista ([secondo questa richiesta su GitHub](https://github.com/forwardemail/forwardemail.net/issues/327)):

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

A partire dall'8 luglio 2025 abbiamo aggiunto questi paesi specifici per l'Europa:

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

In ottobre 2025 abbiamo anche aggiunto <code class="notranslate">cz</code> (Repubblica Ceca) a causa della domanda.

Non abbiamo incluso specificamente `ru` e `ua` a causa dell'elevata attività di spam.

### Qual è il tuo criterio per la allowlist {#what-is-your-allowlist-criteria}

Abbiamo una lista statica di [estensioni di nomi di dominio allowlistate di default](#what-domain-name-extensions-are-allowlisted-by-default) – e manteniamo anche una allowlist dinamica, memorizzata nella cache, basata sui seguenti criteri rigorosi:

* Il dominio root del mittente deve essere di un'[estensione di nome di dominio che corrisponde alla lista che offriamo nel nostro piano gratuito](#what-domain-name-extensions-can-be-used-for-free) (con l'aggiunta di `biz` e `info`). Includiamo anche corrispondenze parziali `edu`, `gov` e `mil`, come `xyz.gov.au` e `xyz.edu.au`.
* Il dominio root del mittente deve essere tra i primi 100.000 risultati unici di dominio root analizzati dalla [Umbrella Popularity List](http://s3-us-west-1.amazonaws.com/umbrella-static/index.html "Umbrella Popularity List") ("UPL").
* Il dominio root del mittente deve essere tra i primi 50.000 risultati di domini root unici presenti in almeno 4 degli ultimi 7 giorni di UPL (~50%+).
* Il dominio root del mittente non deve essere [classificato](https://radar.cloudflare.com/categorization-feedback/) come contenuto per adulti o malware da Cloudflare.
* Il dominio root del mittente deve avere impostati record A o MX.
* Il dominio root del mittente deve avere record A, record MX, record DMARC con `p=reject` o `p=quarantine`, oppure un record SPF con qualificatore `-all` o `~all`.

Se questo criterio è soddisfatto, il dominio root del mittente sarà memorizzato nella cache per 7 giorni. Nota che il nostro processo automatizzato viene eseguito quotidianamente – quindi questa è una cache di allowlist a rotazione che si aggiorna ogni giorno.

Il nostro processo automatizzato scaricherà in memoria gli ultimi 7 giorni di UPL, li decomprimerà e poi li analizzerà in memoria secondo i criteri rigorosi sopra indicati.

I domini popolari al momento della stesura di questo testo come Google, Yahoo, Microsoft, Amazon, Meta, Twitter, Netflix, Spotify e altri – sono ovviamente inclusi.
Se sei un mittente non presente nella nostra allowlist, la prima volta che il tuo dominio root FQDN o indirizzo IP invia un'email, sarai [rate limited](#do-you-have-rate-limiting) e [greylisted](#do-you-have-a-greylist). Nota che questa è una prassi standard adottata come standard email. La maggior parte dei client di server email tenterà di ritentare se riceve un errore di rate limit o greylist (ad esempio un codice di stato errore 421 o di livello 4xx).

**Nota che mittenti specifici come `a@gmail.com`, `b@xyz.edu` e `c@gov.au` possono comunque essere [denylisted](#do-you-have-a-denylist)** (ad esempio se rileviamo automaticamente spam, phishing o malware da quei mittenti).

### Quali estensioni di nomi di dominio possono essere usate gratuitamente {#what-domain-name-extensions-can-be-used-for-free}

Dal 31 marzo 2023 abbiamo applicato una nuova regola generale anti-spam per proteggere i nostri utenti e il servizio.

Questa nuova regola consente di usare solo le seguenti estensioni di nomi di dominio nel nostro piano gratuito:

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
  <li class="list-inline-item"><code class="notranslate">ax</code></li>
  <li class="list-inline-item"><code class="notranslate">ba</code></li>
  <li class="list-inline-item"><code class="notranslate">be</code></li>
  <li class="list-inline-item"><code class="notranslate">bg</code></li>
  <li class="list-inline-item"><code class="notranslate">br</code></li>
  <li class="list-inline-item"><code class="notranslate">by</code></li>
  <li class="list-inline-item"><code class="notranslate">bzh</code></li>
  <li class="list-inline-item"><code class="notranslate">ca</code></li>
  <li class="list-inline-item"><code class="notranslate">cat</code></li>
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
  <li class="list-inline-item"><code class="notranslate">fo</code></li>
  <li class="list-inline-item"><code class="notranslate">fr</code></li>
  <li class="list-inline-item"><code class="notranslate">gf</code></li>
  <li class="list-inline-item"><code class="notranslate">gg</code></li>
  <li class="list-inline-item"><code class="notranslate">gi</code></li>
  <li class="list-inline-item"><code class="notranslate">gl</code></li>
  <li class="list-inline-item"><code class="notranslate">gp</code></li>
  <li class="list-inline-item"><code class="notranslate">gr</code></li>
  <li class="list-inline-item"><code class="notranslate">hr</code></li>
  <li class="list-inline-item"><code class="notranslate">hu</code></li>
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
  <li class="list-inline-item"><code class="notranslate">lt</code></li>
  <li class="list-inline-item"><code class="notranslate">lu</code></li>
  <li class="list-inline-item"><code class="notranslate">lv</code></li>
  <li class="list-inline-item"><code class="notranslate">ly</code></li>
  <li class="list-inline-item"><code class="notranslate">mc</code></li>
  <li class="list-inline-item"><code class="notranslate">md</code></li>
  <li class="list-inline-item"><code class="notranslate">me</code></li>
  <li class="list-inline-item"><code class="notranslate">mk</code></li>
  <li class="list-inline-item"><code class="notranslate">mn</code></li>
  <li class="list-inline-item"><code class="notranslate">mq</code></li>
  <li class="list-inline-item"><code class="notranslate">ms</code></li>
  <li class="list-inline-item"><code class="notranslate">mt</code></li>
  <li class="list-inline-item"><code class="notranslate">mu</code></li>
  <li class="list-inline-item"><code class="notranslate">mx</code></li>
  <li class="list-inline-item"><code class="notranslate">nc</code></li>
  <li class="list-inline-item"><code class="notranslate">net</code></li>
  <li class="list-inline-item"><code class="notranslate">ni</code></li>
  <li class="list-inline-item"><code class="notranslate">nl</code></li>
  <li class="list-inline-item"><code class="notranslate">no</code></li>
  <li class="list-inline-item"><code class="notranslate">nu</code></li>
  <li class="list-inline-item"><code class="notranslate">nz</code></li>
  <li class="list-inline-item"><code class="notranslate">org</code></li>
  <li class="list-inline-item"><code class="notranslate">pf</code></li>
  <li class="list-inline-item"><code class="notranslate">pl</code></li>
  <li class="list-inline-item"><code class="notranslate">pm</code></li>
  <li class="list-inline-item"><code class="notranslate">pr</code></li>
  <li class="list-inline-item"><code class="notranslate">pt</code></li>
  <li class="list-inline-item"><code class="notranslate">pw</code></li>
  <li class="list-inline-item"><code class="notranslate">re</code></li>
  <li class="list-inline-item"><code class="notranslate">ro</code></li>
  <li class="list-inline-item"><code class="notranslate">rs</code></li>
  <li class="list-inline-item"><code class="notranslate">sc</code></li>
  <li class="list-inline-item"><code class="notranslate">se</code></li>
  <li class="list-inline-item"><code class="notranslate">sh</code></li>
  <li class="list-inline-item"><code class="notranslate">si</code></li>
  <li class="list-inline-item"><code class="notranslate">sk</code></li>
  <li class="list-inline-item"><code class="notranslate">sm</code></li>
  <li class="list-inline-item"><code class="notranslate">sr</code></li>
  <li class="list-inline-item"><code class="notranslate">st</code></li>
  <li class="list-inline-item"><code class="notranslate">tc</code></li>
  <li class="list-inline-item"><code class="notranslate">tf</code></li>
  <li class="list-inline-item"><code class="notranslate">tm</code></li>
  <li class="list-inline-item"><code class="notranslate">to</code></li>
  <li class="list-inline-item"><code class="notranslate">tv</code></li>
  <li class="list-inline-item"><code class="notranslate">uk</code></li>
  <li class="list-inline-item"><code class="notranslate">us</code></li>
  <li class="list-inline-item"><code class="notranslate">uz</code></li>
  <li class="list-inline-item"><code class="notranslate">va</code></li>
  <li class="list-inline-item"><code class="notranslate">vc</code></li>
  <li class="list-inline-item"><code class="notranslate">vg</code></li>
  <li class="list-inline-item"><code class="notranslate">vu</code></li>
  <li class="list-inline-item"><code class="notranslate">wf</code></li>
  <li class="list-inline-item"><code class="notranslate">ws</code></li>
  <li class="list-inline-item"><code class="notranslate">xyz</code></li>
  <li class="list-inline-item"><code class="notranslate">yt</code></li>
  <li class="list-inline-item"><code class="notranslate">za</code></li>
</ul>
### Hai una greylist {#do-you-have-a-greylist}

Sì, utilizziamo una politica di [greylisting email](https://en.wikipedia.org/wiki/Greylisting_\(email\)) molto permissiva. Il greylisting si applica solo ai mittenti non presenti nella nostra allowlist e rimane nella nostra cache per 30 giorni.

Per ogni nuovo mittente, memorizziamo una chiave nel nostro database Redis per 30 giorni con un valore impostato sull'orario di arrivo iniziale della loro prima richiesta. Rifiutiamo quindi la loro email con un codice di stato di retry 450 e la lasciamo passare solo dopo che sono trascorsi 5 minuti.

Se hanno atteso con successo 5 minuti da questo orario di arrivo iniziale, allora le loro email saranno accettate e non riceveranno più questo codice di stato 450.

La chiave consiste nel dominio root FQDN o nell'indirizzo IP del mittente. Ciò significa che qualsiasi sottodominio che supera il greylist passerà anche per il dominio root, e viceversa (questo è ciò che intendiamo per una politica "molto permissiva").

Ad esempio, se un'email proviene da `test.example.com` prima che vediamo un'email provenire da `example.com`, allora qualsiasi email da `test.example.com` e/o `example.com` dovrà attendere 5 minuti dall'orario di arrivo iniziale della connessione. Non facciamo attendere separatamente sia `test.example.com` che `example.com` per i loro rispettivi periodi di 5 minuti (la nostra politica di greylisting si applica a livello di dominio root).

Nota che il greylisting non si applica a nessun mittente presente nella nostra [allowlist](#do-you-have-an-allowlist) (ad esempio Meta, Amazon, Netflix, Google, Microsoft al momento della scrittura).

### Hai una denylist {#do-you-have-a-denylist}

Sì, gestiamo una denylist propria che aggiorniamo automaticamente in tempo reale e manualmente in base a spam e attività dannose rilevate.

Scarichiamo inoltre tutti gli indirizzi IP dalla denylist UCEPROTECT Livello 1 da <http://wget-mirrors.uceprotect.net/rbldnsd-all/dnsbl-1.uceprotect.net.gz> ogni ora e li inseriamo nella nostra denylist con una scadenza di 7 giorni.

I mittenti trovati nella denylist riceveranno un codice di errore 421 (indica al mittente di riprovare più tardi) se [non sono presenti nella allowlist](#do-you-have-an-allowlist).

Utilizzando un codice di stato 421 invece di un 554, i potenziali falsi positivi possono essere alleviati in tempo reale e il messaggio può essere consegnato con successo al tentativo successivo.

**Questo è progettato diversamente rispetto ad altri servizi di posta**, dove se vieni inserito in una blocklist, si verifica un errore permanente e definitivo. Spesso è difficile chiedere ai mittenti di ritentare l'invio dei messaggi (specialmente da grandi organizzazioni), quindi questo approccio concede circa 5 giorni dal tentativo iniziale di invio affinché il mittente, il destinatario o noi interveniamo per risolvere il problema (richiedendo la rimozione dalla denylist).

Tutte le richieste di rimozione dalla denylist sono monitorate in tempo reale dagli amministratori (ad esempio per consentire che falsi positivi ricorrenti vengano permanentemente inseriti nella allowlist dagli amministratori).

Le richieste di rimozione dalla denylist possono essere effettuate su <https://forwardemail.net/denylist>. Gli utenti a pagamento hanno le loro richieste di rimozione processate istantaneamente, mentre gli utenti non paganti devono attendere che gli amministratori elaborino la loro richiesta.

I mittenti rilevati come inviatori di spam o contenuti virus saranno aggiunti alla denylist secondo il seguente approccio:

1. L'[impronta iniziale del messaggio](#how-do-you-determine-an-email-fingerprint) viene greylistata al rilevamento di spam o inserimento in blocklist da un mittente "fidato" (ad esempio `gmail.com`, `microsoft.com`, `apple.com`).
   * Se il mittente era nella allowlist, il messaggio viene greylistato per 1 ora.
   * Se il mittente non è nella allowlist, il messaggio viene greylistato per 6 ore.
2. Analizziamo le chiavi della denylist dalle informazioni del mittente e del messaggio, e per ciascuna di queste chiavi creiamo (se non esiste già) un contatore, lo incrementiamo di 1 e lo memorizziamo in cache per 24 ore.
   * Per i mittenti nella allowlist:
     * Aggiungiamo una chiave per l'indirizzo email "MAIL FROM" della busta se ha superato SPF o non ha SPF, e non era [un nome utente postmaster](#what-are-postmaster-addresses) o [un nome utente no-reply](#what-are-no-reply-addresses).
     * Se l'intestazione "From" era nella allowlist, aggiungiamo una chiave per l'indirizzo email dell'intestazione "From" se ha superato SPF o DKIM allineato e superato.
     * Se l'intestazione "From" non era nella allowlist, aggiungiamo una chiave per l'indirizzo email dell'intestazione "From" e per il suo dominio root analizzato.
   * Per i mittenti non presenti nella allowlist:
     * Aggiungiamo una chiave per l'indirizzo email "MAIL FROM" della busta se ha superato SPF.
     * Se l'intestazione "From" era nella allowlist, aggiungiamo una chiave per l'indirizzo email dell'intestazione "From" se ha superato SPF o DKIM allineato e superato.
     * Se l'intestazione "From" non era nella allowlist, aggiungiamo una chiave per l'indirizzo email dell'intestazione "From" e per il suo dominio root analizzato.
     * Aggiungiamo una chiave per l'indirizzo IP remoto del mittente.
     * Aggiungiamo una chiave per il nome host risolto del client tramite reverse lookup dall'indirizzo IP del mittente (se presente).
     * Aggiungiamo una chiave per il dominio root del nome host risolto del client (se presente e se differente dal nome host risolto del client).
3. Se il contatore raggiunge 5 per un mittente e chiave non presenti nella allowlist, allora inseriamo la chiave nella denylist per 30 giorni e viene inviata una email al nostro team abuse. Questi numeri possono cambiare e gli aggiornamenti saranno riportati qui mentre monitoriamo gli abusi.
4. Se il contatore raggiunge 10 per un mittente e chiave presenti nella allowlist, allora inseriamo la chiave nella denylist per 7 giorni e viene inviata una email al nostro team abuse. Questi numeri possono cambiare e gli aggiornamenti saranno riportati qui mentre monitoriamo gli abusi.
> **NOTA:** Nel prossimo futuro introdurremo il monitoraggio della reputazione. Il monitoraggio della reputazione calcolerà invece quando inserire un mittente nella denylist basandosi su una soglia percentuale (anziché su un contatore rudimentale come indicato sopra).

### Avete un limite di velocità {#do-you-have-rate-limiting}

Il limite di velocità del mittente è basato o sul dominio root ottenuto da una ricerca PTR inversa sull'indirizzo IP del mittente – oppure, se ciò non produce risultati, utilizza semplicemente l'indirizzo IP del mittente. Nota che ci riferiamo a questo come `Mittente` di seguito.

I nostri server MX hanno limiti giornalieri per la posta in arrivo ricevuta per [archiviazione IMAP crittografata](/blog/docs/best-quantum-safe-encrypted-email-service):

* Invece di limitare la posta in arrivo ricevuta su base alias individuale (es. `tuo@tuodominio.com`) – limitiamo la velocità in base al nome di dominio dell'alias stesso (es. `tuodominio.com`). Questo impedisce ai `Mittenti` di inondare contemporaneamente le caselle di posta di tutti gli alias del tuo dominio.
* Abbiamo limiti generali che si applicano a tutti i `Mittenti` del nostro servizio indipendentemente dal destinatario:
  * I `Mittenti` che consideriamo "affidabili" come fonte di verità (es. `gmail.com`, `microsoft.com`, `apple.com`) sono limitati a inviare 100 GB al giorno.
  * I `Mittenti` che sono [allowlistati](#do-you-have-an-allowlist) sono limitati a inviare 10 GB al giorno.
  * Tutti gli altri `Mittenti` sono limitati a inviare 1 GB e/o 1000 messaggi al giorno.
* Abbiamo un limite specifico per ogni `Mittente` e `tuodominio.com` di 1 GB e/o 1000 messaggi giornalieri.

I server MX limitano anche i messaggi inoltrati a uno o più destinatari tramite limitazione di velocità – ma questo si applica solo ai `Mittenti` non presenti nella [allowlist](#do-you-have-an-allowlist):

* Permettiamo solo fino a 100 connessioni all'ora, per dominio root FQDN risolto del `Mittente` (o) indirizzo IP remoto del `Mittente` (se non è disponibile un PTR inverso), e per destinatario in busta. Conserviamo la chiave per la limitazione di velocità come hash crittografico nel nostro database Redis.

* Se invii email tramite il nostro sistema, assicurati di avere un PTR inverso configurato per tutti i tuoi indirizzi IP (altrimenti ogni dominio root FQDN unico o indirizzo IP da cui invii sarà soggetto a limitazione di velocità).

* Nota che se invii tramite un sistema popolare come Amazon SES, non sarai soggetto a limitazione di velocità poiché (al momento della stesura) Amazon SES è elencato nella nostra allowlist.

* Se invii da un dominio come `test.abc.123.example.com`, il limite di velocità sarà imposto su `example.com`. Molti spammer usano centinaia di sottodomini per aggirare i filtri antispam comuni che limitano solo i nomi host unici anziché i domini root FQDN unici.

* I `Mittenti` che superano il limite di velocità saranno rifiutati con un errore 421.

I nostri server IMAP e SMTP limitano i tuoi alias a non avere più di `60` connessioni concorrenti contemporaneamente.

I nostri server MX limitano i mittenti [non allowlistati](#do-you-have-an-allowlist) a non stabilire più di 10 connessioni concorrenti (con scadenza della cache del contatore di 3 minuti, che rispecchia il timeout socket di 3 minuti).

### Come proteggete contro il backscatter {#how-do-you-protect-against-backscatter}

I rimbalzi errati o lo spam di rimbalzo (conosciuto come "[Backscatter](https://en.wikipedia.org/wiki/Backscatter_\(email\))") possono causare una reputazione negativa agli indirizzi IP dei mittenti.

Adottiamo due misure per proteggere contro il backscatter, dettagliate nelle sezioni seguenti [Prevenire i rimbalzi da noti spammer MAIL FROM](#prevent-bounces-from-known-mail-from-spammers) e [Prevenire rimbalzi non necessari per proteggere contro il backscatter](#prevent-unnecessary-bounces-to-protect-against-backscatter).

### Prevenire i rimbalzi da noti spammer MAIL FROM {#prevent-bounces-from-known-mail-from-spammers}

Scarichiamo la lista da [Backscatter.org](https://www.backscatterer.org/) (alimentato da [UCEPROTECT](https://www.uceprotect.net/)) da <http://wget-mirrors.uceprotect.net/rbldnsd-all/ips.backscatterer.org.gz> ogni ora e la inseriamo nel nostro database Redis (confrontiamo anche in anticipo le differenze; nel caso qualche IP sia stato rimosso e debba essere rispettato).
Se il MAIL FROM è vuoto O è uguale (case-insensitive) a uno qualsiasi degli [indirizzi postmaster](#what-are-postmaster-addresses) (la parte prima della @ in un'email), allora verifichiamo se l'IP del mittente corrisponde a uno di questa lista.

Se l'IP del mittente è elencato (e non nella nostra [allowlist](#do-you-have-an-allowlist)), allora inviamo un errore 554 con il messaggio `The IP ${session.remoteAddress} is blocked by https://www.backscatterer.org/index.php?target=test&ip=${session.remoteAddress}`.  Saremo avvisati se un mittente è sia nella lista Backscatterer che nella nostra allowlist così da poter risolvere il problema se necessario.

Le tecniche descritte in questa sezione aderiscono alla raccomandazione "SAFE MODE" su <https://www.backscatterer.org/?target=usage> – dove controlliamo l'IP del mittente solo se certe condizioni sono già state soddisfatte.

### Prevenire rimbalzi non necessari per proteggere contro il backscatter {#prevent-unnecessary-bounces-to-protect-against-backscatter}

I rimbalzi sono email che indicano che l'inoltro dell'email al destinatario è completamente fallito e l'email non verrà ritentata.

Una ragione comune per essere inseriti nella lista Backscatterer è il rimbalzo errato o lo spam di rimbalzo, quindi dobbiamo proteggerci in diversi modi:

1. Inviamo solo quando si verificano errori con codice >= 500 (quando le email tentate di inoltrare sono fallite, ad esempio Gmail risponde con un errore di livello 500).

2. Inviamo solo una volta e una sola volta (usiamo una chiave di impronta del rimbalzo calcolata e la memorizziamo nella cache per evitare invii duplicati).  L'impronta del rimbalzo è una chiave che è l'impronta del messaggio combinata con un hash dell'indirizzo di rimbalzo e del suo codice di errore).  Vedi la sezione su [Fingerprinting](#how-do-you-determine-an-email-fingerprint) per maggiori dettagli su come viene calcolata l'impronta del messaggio.  Le impronte di rimbalzo inviate con successo scadranno dopo 7 giorni nella nostra cache Redis.

3. Inviamo solo quando MAIL FROM e/o From non sono vuoti e non contengono (case-insensitive) un [nome utente postmaster](#what-are-postmaster-addresses) (la parte prima della @ in un'email).

4. Non inviamo se il messaggio originale aveva uno dei seguenti header (case-insensitive):

   * Header `auto-submitted` con valore diverso da `no`.
   * Header `x-auto-response-suppress` con valore `dr`, `autoreply`, `auto-reply`, `auto_reply` o `all`
   * Header `list-id`, `list-subscribe`, `list-unsubscribe`, `list-help`, `list-post`, `list-owner`, `list-archive`, `x-autoreply`, `x-autorespond` o `x-auto-respond` (indipendentemente dal valore).
   * Header `precedence` con valore `bulk`, `autoreply`, `auto-reply`, `auto_reply` o `list`.

5. Non inviamo se l'indirizzo email MAIL FROM o From termina con `+donotreply`, `-donotreply`, `+noreply` o `-noreply`.

6. Non inviamo se la parte username dell'indirizzo email From era `mdaemon` e aveva un header case-insensitive `X-MDDSN-Message`.

7. Non inviamo se era presente un header case-insensitive `content-type` di tipo `multipart/report`.

### Come determini l'impronta di un'email {#how-do-you-determine-an-email-fingerprint}

L'impronta di un'email è usata per determinare l'unicità di un'email e per prevenire la consegna di messaggi duplicati e l'invio di [rimbalzi duplicati](#prevent-unnecessary-bounces-to-protect-against-backscatter).

L'impronta è calcolata dalla seguente lista:

* Nome host FQDN risolto dal client o indirizzo IP
* Valore dell'header `Message-ID` (se presente)
* Valore dell'header `Date` (se presente)
* Valore dell'header `From` (se presente)
* Valore dell'header `To` (se presente)
* Valore dell'header `Cc` (se presente)
* Valore dell'header `Subject` (se presente)
* Valore del `Body` (se presente)

### Posso inoltrare email a porte diverse dalla 25 (ad esempio se il mio ISP ha bloccato la porta 25) {#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25}

Sì, dal 5 maggio 2020 abbiamo aggiunto questa funzionalità.  Al momento la funzionalità è specifica per dominio, non per alias.  Se hai bisogno che sia specifica per alias, contattaci per farci sapere le tue esigenze.

<div class="alert my-3 alert-danger">
  <i class="fa fa-stop-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Protezione della Privacy Avanzata:
  </strong>
  <span>
    Se sei su un piano a pagamento (che include protezione della privacy avanzata), vai su <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Il Mio Account <i class="fa fa-angle-right"></i> Domini</a>, clicca su "Setup" accanto al tuo dominio, quindi clicca su "Impostazioni".  Se vuoi saperne di più sui piani a pagamento consulta la nostra pagina <a class="alert-link" rel="noopener noreferrer" href="/private-business-email">Prezzi</a>.  Altrimenti puoi continuare a seguire le istruzioni qui sotto.
  </span>
</div>
Se sei sul piano gratuito, aggiungi semplicemente un nuovo record DNS <strong class="notranslate">TXT</strong> come mostrato di seguito, ma cambia la porta da 25 alla porta che preferisci.

Ad esempio, se voglio che tutte le email che vanno a `example.com` vengano inoltrate alla porta SMTP degli alias destinatari 1337 invece di 25:

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
      <td><code>forward-email-port=1337</code></td>
    </tr>
  </tbody>
</table>

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Suggerimento:
  </strong>
    Lo scenario più comune per la configurazione di inoltro con porta personalizzata è quando vuoi inoltrare tutte le email che vanno a example.com a una porta diversa su example.com, diversa dalla porta standard SMTP 25. Per configurarlo, aggiungi semplicemente il seguente record <strong class="notranslate">TXT</strong> catch-all.
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
      <td><em>"@", ".", o vuoto</em></td>
      <td class="text-center">3600</td>
      <td class="notranslate">TXT</td>
      <td><code>forward-email=example.com</code></td>
    </tr>
  </tbody>
</table>

### Supporta il simbolo più + per gli alias Gmail {#does-it-support-the-plus--symbol-for-gmail-aliases}

Sì, assolutamente.

### Supporta i sottodomini {#does-it-support-sub-domains}

Sì, assolutamente. Invece di usare "@", ".", o vuoto come nome/host/alias, usa semplicemente il nome del sottodominio come valore.

Se vuoi che `foo.example.com` inoltri le email, inserisci `foo` come valore nome/host/alias nelle impostazioni DNS (sia per i record MX che per i record <strong class="notranslate">TXT</strong>).

### Questo inoltra le intestazioni delle mie email? {#does-this-forward-my-emails-headers}

Sì, assolutamente.

### È ben testato? {#is-this-well-tested}

Sì, sono stati scritti test con [ava](https://github.com/avajs/ava) e ha anche copertura del codice.

### Passate i messaggi e i codici di risposta SMTP? {#do-you-pass-along-smtp-response-messages-and-codes}

Sì, assolutamente. Ad esempio, se stai inviando un'email a `hello@example.com` e è registrata per inoltrare a `user@gmail.com`, il messaggio e il codice di risposta SMTP dal server SMTP "gmail.com" verranno restituiti invece che dal server proxy "mx1.forwardemail.net" o "mx2.forwardemail.net".

### Come prevenite gli spammer e garantite una buona reputazione di inoltro email? {#how-do-you-prevent-spammers-and-ensure-good-email-forwarding-reputation}

Consulta le nostre sezioni su [Come funziona il vostro sistema di inoltro email](#how-does-your-email-forwarding-system-work), [Come gestite i problemi di consegna email](#how-do-you-handle-email-delivery-issues) e [Come gestite il blocco dei vostri indirizzi IP](#how-do-you-handle-your-ip-addresses-becoming-blocked) sopra.

### Come effettuate le ricerche DNS sui nomi di dominio? {#how-do-you-perform-dns-lookups-on-domain-names}

Abbiamo creato un progetto software open-source :tangerine: [Tangerine](https://github.com/forwardemail/tangerine) e lo usiamo per le ricerche DNS. I server DNS predefiniti usati sono `1.1.1.1` e `1.0.0.1`, e le query DNS avvengono tramite [DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS) ("DoH") a livello applicativo.

:tangerine: [Tangerine](https://github.com/tangerine) usa di default [il servizio DNS consumer privacy-first di CloudFlare][cloudflare-dns].


## Account e Fatturazione {#account-and-billing}

### Offrite una garanzia di rimborso sui piani a pagamento? {#do-you-offer-a-money-back-guarantee-on-paid-plans}

Sì! I rimborsi automatici avvengono quando effettui un upgrade, downgrade o cancelli il tuo account entro 30 giorni dall'inizio del piano. Questo vale solo per i clienti alla prima sottoscrizione.
### Se cambio piano, fate il pro-rata e rimborsate la differenza {#if-i-switch-plans-do-you-pro-rate-and-refund-the-difference}

Non facciamo il pro-rata né rimborsiamo la differenza quando cambi piano. Invece convertiamo la durata residua dalla data di scadenza del tuo piano attuale nella durata relativa più vicina per il tuo nuovo piano (arrotondata per difetto al mese).

Nota che se effettui un upgrade o downgrade tra piani a pagamento entro una finestra di 30 giorni dall'inizio del primo piano a pagamento, allora rimborseremo automaticamente l'intero importo del tuo piano esistente.

### Posso usare questo servizio di inoltro email come server MX "fallback" o "fallover" {#can-i-just-use-this-email-forwarding-service-as-a-fallback-or-fallover-mx-server}

No, non è consigliato, poiché puoi usare un solo server di scambio mail alla volta. I fallback di solito non vengono mai ritentati a causa di configurazioni errate delle priorità e dei server di posta che non rispettano il controllo della priorità MX.

### Posso disabilitare alias specifici {#can-i-disable-specific-aliases}

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Se sei su un piano a pagamento, devi andare su <a href="/my-account/domains" target="_blank" rel="noopener noreferrer" class="alert-link">Il Mio Account <i class="fa fa-angle-right"></i> Domini</a> <i class="fa fa-angle-right"></i> Alias <i class="fa fa-angle-right"></i> Modifica Alias <i class="fa fa-angle-right"></i> Deseleziona la casella "Attivo" <i class="fa fa-angle-right"></i> Continua.
  </span>
</div>

Sì, modifica semplicemente il tuo record DNS <strong class="notranslate">TXT</strong> e anteponi all'alias uno, due o tre punti esclamativi (vedi sotto).

Nota che *dovresti* preservare il mapping ":" poiché è necessario se decidi di riattivarlo (ed è anche usato per l'importazione se esegui l'upgrade a uno dei nostri piani a pagamento).

**Per rifiuto silenzioso (appare al mittente come se il messaggio fosse inviato con successo, ma in realtà non arriva da nessuna parte) (codice di stato `250`):** Se anteponi un alias con "!" (punto esclamativo singolo) restituirà un codice di stato `250` di successo ai mittenti che tentano di inviare a questo indirizzo, ma le email stesse non arriveranno da nessuna parte (es. un buco nero o `/dev/null`).

**Per rifiuto soft (codice di stato `421`):** Se anteponi un alias con "!!" (doppio punto esclamativo) restituirà un codice di errore soft `421` ai mittenti che tentano di inviare a questo indirizzo, e le email verranno spesso ritentate per fino a 5 giorni prima del rifiuto e del bounce.

**Per rifiuto hard (codice di stato `550`):** Se anteponi un alias con "!!!" (triplo punto esclamativo) restituirà un codice di errore permanente `550` ai mittenti che tentano di inviare a questo indirizzo e le email verranno rifiutate e respinte.

Per esempio, se voglio che tutte le email che arrivano a `alias@example.com` smettano di essere inoltrate a `user@gmail.com` e vengano rifiutate e respinte (es. usa tre punti esclamativi):

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
    Puoi anche riscrivere l'indirizzo del destinatario inoltrato semplicemente in "nobody@forwardemail.net", che lo indirizzerà a nessuno come nell'esempio qui sotto.
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
    Se desideri una maggiore sicurezza, puoi anche rimuovere la parte ":user@gmail.com" (o ":nobody@forwardemail.net"), lasciando solo "!!!alias" come nell'esempio qui sotto.
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
      <td><code>forward-email=!!!alias</code></td>
    </tr>
  </tbody>
</table>

### Posso inoltrare le email a più destinatari {#can-i-forward-emails-to-multiple-recipients}

Sì, assolutamente. Basta specificare più destinatari nei tuoi record <strong class="notranslate">TXT</strong>.

Ad esempio, se voglio che una email inviata a `hello@example.com` venga inoltrata a `user+a@gmail.com` e `user+b@gmail.com`, il mio record <strong class="notranslate">TXT</strong> sarà così:

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

Oppure, puoi specificarli in due righe separate, come questa:

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

Sì, puoi. Basta specificare più destinatari globali catch-all nei tuoi record <strong class="notranslate">TXT</strong>.

Ad esempio, se voglio che ogni email inviata a `*@example.com` (l'asterisco significa che è un carattere jolly, cioè catch-all) venga inoltrata a `user+a@gmail.com` e `user+b@gmail.com`, il mio record <strong class="notranslate">TXT</strong> sarà così:

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

Oppure, puoi specificarli in due righe separate, come questa:

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

Sì, il limite predefinito è 10. Questo NON significa che puoi avere solo 10 alias sul tuo nome di dominio. Puoi avere quanti alias vuoi (un numero illimitato). Significa che puoi inoltrare un alias a 10 indirizzi email unici. Potresti avere `hello:user+1@gmail.com`, `hello:user+2@gmail.com`, `hello:user+3@gmail.com`, … (da 1 a 10) – e tutte le email a `hello@example.com` verrebbero inoltrate a `user+1@gmail.com`, `user+2@gmail.com`, `user+3@gmail.com`, … (da 1 a 10).

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Suggerimento:
  </strong>
  <span>
    Ti servono più di 10 destinatari per alias? Inviaci un'email e saremo felici di aumentare il limite del tuo account.
  </span>
</div>

### Posso inoltrare le email in modo ricorsivo {#can-i-recursively-forward-emails}

Sì, puoi, tuttavia devi comunque rispettare il limite massimo. Se hai `hello:linus@example.com` e `linus:user@gmail.com`, allora le email a `hello@example.com` verrebbero inoltrate a `linus@example.com` e `user@gmail.com`. Nota che verrà generato un errore se tenti di inoltrare ricorsivamente email oltre il limite massimo.

### Le persone possono annullare o registrare il mio inoltro email senza il mio permesso {#can-people-unregister-or-register-my-email-forwarding-without-my-permission}

Utilizziamo la verifica dei record MX e <strong class="notranslate">TXT</strong>, quindi se aggiungi i rispettivi record MX e <strong class="notranslate">TXT</strong> di questo servizio, allora sei registrato. Se li rimuovi, allora sei cancellato. Hai la proprietà del tuo dominio e la gestione del DNS, quindi se qualcuno ha accesso a questo allora è un problema.

### Come è possibile che sia gratuito {#how-is-it-free}

Forward Email offre un piano gratuito grazie a una combinazione di sviluppo open source, infrastruttura efficiente e piani a pagamento opzionali che supportano il servizio.

Il nostro piano gratuito è supportato da:

1. **Sviluppo Open Source**: Il nostro codice è open source, permettendo contributi dalla comunità e un’operazione trasparente.

2. **Infrastruttura Efficiente**: Abbiamo ottimizzato i nostri sistemi per gestire l’inoltro email con risorse minime.

3. **Piani Premium a Pagamento**: Gli utenti che necessitano di funzionalità aggiuntive come invio SMTP, ricezione IMAP o opzioni di privacy avanzate sottoscrivono i nostri piani a pagamento.

4. **Limiti di Utilizzo Ragionevoli**: Il piano gratuito ha politiche di uso corretto per prevenire abusi.

> \[!NOTE]
> Ci impegniamo a mantenere l’inoltro email di base gratuito offrendo al contempo funzionalità premium per utenti con esigenze più avanzate.

> \[!TIP]
> Se trovi il nostro servizio utile, considera di passare a un piano a pagamento per supportare lo sviluppo e la manutenzione continui.

### Qual è il limite massimo di dimensione delle email {#what-is-the-max-email-size-limit}

Il limite predefinito è di 50MB, che include contenuto, intestazioni e allegati. Nota che servizi come Gmail e Outlook consentono solo un limite di 25MB, e se superi il limite inviando a indirizzi di questi provider riceverai un messaggio di errore.

Viene restituito un errore con il codice di risposta appropriato se il limite di dimensione del file viene superato.

### Conservate i log delle email {#do-you-store-logs-of-emails}

No, non scriviamo su disco né conserviamo log – con [l’eccezione degli errori](#do-you-store-error-logs) e [SMTP in uscita](#do-you-support-sending-email-with-smtp) (vedi la nostra [Privacy Policy](/privacy)).

Tutto viene fatto in memoria e [il nostro codice sorgente è su GitHub](https://github.com/forwardemail).

### Conservate i log degli errori {#do-you-store-error-logs}

**Sì. Puoi accedere ai log degli errori sotto [Il Mio Account → Log](/my-account/logs) o [Il Mio Account → Domini](/my-account/domains).**

Da febbraio 2023, conserviamo i log degli errori per i codici di risposta SMTP `4xx` e `5xx` per un periodo di 7 giorni – che contengono l’errore SMTP, l’involucro e le intestazioni email (non conserviamo il corpo dell’email né gli allegati).
I log degli errori ti permettono di controllare la mancanza di email importanti e di mitigare i falsi positivi dello spam per [i tuoi domini](/my-account/domains). Sono anche una grande risorsa per il debug dei problemi con gli [webhook email](#do-you-support-webhooks) (poiché i log degli errori contengono la risposta dell'endpoint webhook).

I log degli errori per il [rate limiting](#do-you-have-rate-limiting) e il [greylisting](#do-you-have-a-greylist) non sono accessibili poiché la connessione termina anticipatamente (ad esempio prima che i comandi `RCPT TO` e `MAIL FROM` possano essere trasmessi).

Consulta la nostra [Privacy Policy](/privacy) per maggiori informazioni.

### Leggete le mie email {#do-you-read-my-emails}

No, assolutamente no. Consulta la nostra [Privacy Policy](/privacy).

Molti altri servizi di inoltro email memorizzano e potrebbero potenzialmente leggere le tue email. Non c'è motivo per cui le email inoltrate debbano essere memorizzate su disco – per questo abbiamo progettato la prima soluzione open-source che fa tutto in memoria.

Crediamo che tu debba avere il diritto alla privacy e lo rispettiamo rigorosamente. Il codice distribuito sul server è [software open-source su GitHub](https://github.com/forwardemail) per trasparenza e per costruire fiducia.

### Posso "inviare mail come" in Gmail con questo {#can-i-send-mail-as-in-gmail-with-this}

Sì! Dal 2 ottobre 2018 abbiamo aggiunto questa funzionalità. Consulta [Come inviare mail come usando Gmail](#how-to-send-mail-as-using-gmail) sopra!

Dovresti anche impostare il record SPF per Gmail nella tua configurazione DNS nel record <strong class="notranslate">TXT</strong>.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Se usi Gmail (ad esempio Invia mail come) o G Suite, dovrai aggiungere <code>include:_spf.google.com</code> al tuo record SPF <strong class="notranslate">TXT</strong>, per esempio:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:_spf.google.com -all</code>
  </span>
</div>

### Posso "inviare mail come" in Outlook con questo {#can-i-send-mail-as-in-outlook-with-this}

Sì! Dal 2 ottobre 2018 abbiamo aggiunto questa funzionalità. Consulta semplicemente questi due link di Microsoft qui sotto:

* <https://support.office.com/en-us/article/add-or-remove-an-email-alias-in-outlook-com-459b1989-356d-40fa-a689-8f285b13f1f2>
* <https://support.office.com/en-us/article/send-email-from-a-different-address-in-outlook-com-ccba89cb-141c-4a36-8c56-6d16a8556d2e>

Dovresti anche impostare il record SPF per Outlook nella tua configurazione DNS nel record <strong class="notranslate">TXT</strong>.

<div class="alert my-3 alert-warning">
  <i class="fa fa-exclamation-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Importante:
  </strong>
  <span>
    Se usi Microsoft Outlook o Live.com, dovrai aggiungere <code>include:spf.protection.outlook.com</code> al tuo record SPF <strong class="notranslate">TXT</strong>, per esempio:
    <br /><br />
    <code>v=spf1 a include:spf.forwardemail.net include:spf.protection.outlook.com -all</code>
  </span>
</div>

### Posso "inviare mail come" in Apple Mail e iCloud Mail con questo {#can-i-send-mail-as-in-apple-mail-and-icloud-mail-with-this}

Se sei un abbonato a iCloud+, puoi usare un dominio personalizzato. [Il nostro servizio è anche compatibile con Apple Mail](#apple-mail).

Consulta <https://support.apple.com/en-us/102540> per maggiori informazioni.

### Posso inoltrare email illimitate con questo {#can-i-forward-unlimited-emails-with-this}

Sì, tuttavia i mittenti "relativamente sconosciuti" sono limitati a 100 connessioni all'ora per hostname o IP. Consulta la sezione su [Rate Limiting](#do-you-have-rate-limiting) e [Greylisting](#do-you-have-a-greylist) sopra.

Per "relativamente sconosciuti" intendiamo mittenti che non compaiono nella [allowlist](#do-you-have-an-allowlist).

Se questo limite viene superato, inviamo un codice di risposta 421 che indica al server di posta del mittente di riprovare più tardi.

### Offrite domini illimitati a un prezzo unico {#do-you-offer-unlimited-domains-for-one-price}

Sì. Indipendentemente dal piano a cui sei iscritto, pagherai una sola tariffa mensile – che copre tutti i tuoi domini.
### Quali metodi di pagamento accettate {#which-payment-methods-do-you-accept}

Forward Email accetta i seguenti metodi di pagamento una tantum o mensili/trimestrali/annuali:

1. **Carte di credito/debito/bonifici bancari**: Visa, Mastercard, American Express, Discover, JCB, Diners Club, ecc.
2. **PayPal**: Collega il tuo account PayPal per pagamenti facili
3. **Criptovalute**: Accettiamo pagamenti tramite i pagamenti in stablecoin di Stripe sulle reti Ethereum, Polygon e Solana

> \[!NOTE]
> Conserviamo informazioni di pagamento limitate sui nostri server, che includono solo identificatori di pagamento e riferimenti a [Stripe](https://stripe.com/global) e [PayPal](https://www.paypal.com) per transazioni, clienti, abbonamenti e ID di pagamento.

> \[!TIP]
> Per la massima privacy, considera di utilizzare pagamenti in criptovalute.

Tutti i pagamenti sono elaborati in modo sicuro tramite Stripe o PayPal. I dettagli del tuo pagamento non vengono mai memorizzati sui nostri server.


## Risorse aggiuntive {#additional-resources}

> \[!TIP]
> I nostri articoli qui sotto sono aggiornati regolarmente con nuove guide, consigli e informazioni tecniche. Controlla spesso per i contenuti più recenti.

* [Studi di caso e documentazione per sviluppatori](/blog/docs)
* [Risorse](/resources)
* [Guide](/guides)

[gmail-2fa]: https://myaccount.google.com/signinoptions/two-step-verification

[cloudflare-dns]: https://blog.cloudflare.com/announcing-1111/
