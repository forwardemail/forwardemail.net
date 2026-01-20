# Informativa sulla privacy {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email privacy policy" classe="arrotondato-lg" />

## Indice {#table-of-contents}

* [Disclaimer](#disclaimer)
* [Informazioni non raccolte](#information-not-collected)
* [Informazioni raccolte](#information-collected)
* [Informazioni condivise](#information-shared)
* [Rimozione delle informazioni](#information-removal)
* [Ulteriori divulgazioni](#additional-disclosures)

## Dichiarazione di non responsabilità {#disclaimer}

Si prega di fare riferimento al nostro [Termini](/terms) poiché si applica all'intero sito.

## Informazioni non raccolte {#information-not-collected}

**Ad eccezione di [errori](/faq#do-you-store-error-logs), [email SMTP in uscita](/faq#do-you-support-sending-email-with-smtp) e/o quando viene rilevato spam o attività dannosa (ad esempio per limitare la velocità):**

* Non memorizziamo le email inoltrate su disco né su database.
* Non memorizziamo metadati relativi alle email su disco né su database.
* Non memorizziamo log o indirizzi IP su disco né su database.

## Informazioni raccolte {#information-collected}

Per trasparenza, in qualsiasi momento puoi <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">visualizzare il nostro codice sorgente</a> per vedere come vengono raccolte e utilizzate le informazioni seguenti:

**Solo per motivi di funzionalità e per migliorare il nostro servizio, raccogliamo e memorizziamo in modo sicuro le seguenti informazioni:**

* Memorizziamo email e informazioni del calendario nel tuo [database SQLite crittografato](/blog/docs/best-quantum-safe-encrypted-email-service) esclusivamente per il tuo accesso IMAP/POP3/CalDAV/CardDAV e per le funzionalità della casella di posta.
* Tieni presente che se utilizzi solo i nostri servizi di inoltro email, nessuna email verrà archiviata su disco o database, come descritto in [Informazioni non raccolte](#information-not-collected).
* I nostri servizi di inoltro email operano solo in memoria (nessuna scrittura su disco o database).
* L'archiviazione IMAP/POP3/CalDAV/CardDAV è crittografata a riposo, crittografata in transito e archiviata su un disco crittografato LUKS.
* I backup per l'archiviazione IMAP/POP3/CalDAV/CardDAV sono crittografati a riposo, crittografati in transito e archiviati in [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/).
* Memorizziamo un cookie in una sessione per il traffico del tuo sito web.
* Memorizziamo l'indirizzo email che ci fornisci. * Conserviamo i nomi di dominio, gli alias e le configurazioni che ci fornisci.
* Conserviamo i codici di risposta SMTP `4xx` e `5xx` e [registri degli errori](/faq#do-you-store-error-logs) per 7 giorni.
* Conserviamo [email SMTP in uscita](/faq#do-you-support-sending-email-with-smtp) per circa 30 giorni.
* Questa durata varia in base all'intestazione "Date"; poiché consentiamo l'invio di email in futuro se esiste un'intestazione "Date" futura.
* **Tieni presente che una volta che un'email viene recapitata correttamente o si verifica un errore permanente, redigeremo ed elimineremo il corpo del messaggio.**
* Se desideri configurare il corpo del messaggio SMTP in uscita in modo che venga conservato per un periodo superiore al valore predefinito di 0 giorni (dopo la consegna corretta o un errore permanente), accedi alle Impostazioni avanzate del tuo dominio e inserisci un valore compreso tra `0` e `30`. * Alcuni utenti apprezzano l'utilizzo della funzione di anteprima [Il mio account > Email](/my-account/emails) per vedere come vengono visualizzate le loro email, pertanto supportiamo un periodo di conservazione configurabile.
* Si noti che supportiamo anche __PROTECTED_LINK_30__0.
* Qualsiasi informazione aggiuntiva che ci fornisci volontariamente, come commenti o domande inviati via email o tramite la nostra pagina di <a href="/help">aiuto</a>.

## Informazioni condivise {#information-shared}

Non condividiamo le tue informazioni con terze parti. Inoltre, non utilizziamo software di analisi o di telemetria di terze parti.

Potremmo dover ottemperare alle richieste legali ordinate dal tribunale e lo faremo (ma tieni presente [non raccogliamo le informazioni menzionate sopra nella sezione "Informazioni non raccolte"](#information-not-collected), quindi non saremo in grado di fornirlo fin dall'inizio).

## Rimozione delle informazioni {#information-removal}

Se in qualsiasi momento desideri rimuovere le informazioni che ci hai fornito, vai su <a href="/my-account/security">Il mio account > Sicurezza</a> e clicca su "Elimina account".

Per prevenire e mitigare gli abusi, il tuo account potrebbe richiedere la revisione dell'eliminazione manuale da parte dei nostri amministratori se lo elimini entro 5 giorni dal tuo primo pagamento.

Questo processo richiede solitamente meno di 24 ore ed è stato implementato perché gli utenti inviavano spam al nostro servizio e poi eliminavano rapidamente i loro account, il che ci ha impedito di bloccare le impronte digitali dei loro metodi di pagamento su Stripe.

## Ulteriori divulgazioni {#additional-disclosures}

Questo sito è protetto da Cloudflare e si applicano i seguenti vincoli: [politica sulla riservatezza](https://www.cloudflare.com/privacypolicy/) e [Termini di servizio](https://www.cloudflare.com/website-terms/).