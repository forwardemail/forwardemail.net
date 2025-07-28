# Porta 25 bloccata dalla soluzione alternativa dell'ISP {#port-25-blocked-by-isp-workaround}

## Indice {#table-of-contents}

* [Come aggirare il blocco SMTP in entrata sulla porta 25 da parte dell'ISP](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Come aggirare il blocco SMTP in uscita sulla porta 25 da parte dell'ISP](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Come posso verificare se il mio ISP blocca le porte?](#how-can-i-check-if-my-isp-blocks-ports)

## Come aggirare il blocco SMTP in entrata sulla porta 25 da parte dell'ISP {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Se la porta 25 non è aperta sull'indirizzo IP del tuo server di posta, questa guida fa al caso tuo.

Ad esempio, supponiamo che tu stia gestendo un server di posta personalizzato a casa e il tuo fornitore di servizi Internet ("ISP") ha bloccato la porta in uscita 25.

Poiché non è possibile avere traffico in uscita sulla porta 25, molto probabilmente non ci sarà nemmeno traffico in entrata sulla porta 25 a causa di questo blocco.

Supponendo che tu stia utilizzando il nostro servizio per inoltrare e-mail, [puoi aggirare questo problema tramite la nostra risposta alle FAQ qui](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).

## Come aggirare il blocco SMTP in uscita sulla porta 25 da parte dell'ISP {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Se il tuo ISP blocca la porta in uscita 25, dovrai trovare una soluzione alternativa o contattarlo.

## Come posso verificare se il mio ISP blocca le porte {#how-can-i-check-if-my-isp-blocks-ports}

Puoi eseguire `telnet smtp.forwardemail.net 25` dalla riga di comando o dal terminale per verificare se la connessione in uscita sulla porta 25 è bloccata.