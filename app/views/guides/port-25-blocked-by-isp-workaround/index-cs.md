# Port 25 blokován ISP - řešení {#port-25-blocked-by-isp-workaround}


## Obsah {#table-of-contents}

* [Jak obejít blokování příchozího SMTP na portu 25 poskytovatelem ISP](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Jak obejít blokování odchozího SMTP na portu 25 poskytovatelem ISP](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Jak zjistit, zda můj ISP blokuje porty](#how-can-i-check-if-my-isp-blocks-ports)


## Jak obejít blokování příchozího SMTP na portu 25 poskytovatelem ISP {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Pokud nemáte otevřený port 25 na IP adrese vašeho mailového serveru, pak je tento návod právě pro vás.

Například provozujete vlastní mailový server doma a váš poskytovatel internetových služeb ("ISP") zablokoval odchozí port 25.

Jelikož nemůžete mít odchozí provoz na portu 25, pravděpodobně také nebudete mít příchozí provoz na portu 25 kvůli tomuto bloku.

Pokud používáte naši službu pro přeposílání e-mailů, [můžete tento problém obejít pomocí naší odpovědi v FAQ zde](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).


## Jak obejít blokování odchozího SMTP na portu 25 poskytovatelem ISP {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Pokud váš ISP blokuje odchozí port 25, budete muset najít alternativní řešení nebo je kontaktovat.


## Jak zjistit, zda můj ISP blokuje porty {#how-can-i-check-if-my-isp-blocks-ports}

Můžete spustit `telnet smtp.forwardemail.net 25` z příkazového řádku nebo terminálu, abyste zjistili, zda je vaše odchozí spojení na port 25 blokováno.
