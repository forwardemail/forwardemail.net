# Port 25 blokován alternativním řešením poskytovatele internetových služeb {#port-25-blocked-by-isp-workaround}

__CHRÁNĚNÁ_URL_2__ Obsah {__CHRÁNĚNÁ_URL_3__

* [Jak obejít ISP blokování příchozích SMTP na portu 25](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Jak obejít ISP blokování odchozího SMTP na portu 25](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Jak mohu zkontrolovat, zda můj ISP blokuje porty](#how-can-i-check-if-my-isp-blocks-ports)

## Jak obejít blokování příchozích SMTP zpráv poskytovatelem internetových služeb na portu 25 {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Pokud nemáte otevřený port 25 na IP adrese vašeho poštovního serveru, pak je tento průvodce určen právě vám.

Například máte doma vlastní poštovní server a váš poskytovatel internetových služeb (ISP) zablokoval odchozí port 25.

Vzhledem k tomu, že nemůžete mít odchozí provoz na portu 25, s největší pravděpodobností také nebudete mít příchozí provoz na portu 25 kvůli tomuto bloku.

Za předpokladu, že používáte naši službu k přeposílání e-mailů, [tento problém můžete vyřešit prostřednictvím naší odpovědi na nejčastější dotazy zde](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).

## Jak obejít blokování odchozího SMTP serveru poskytovatelem internetových služeb na portu 25 {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Pokud váš ISP blokuje odchozí port 25, budete muset najít alternativní řešení nebo je kontaktovat.

## Jak mohu zkontrolovat, zda můj poskytovatel internetových služeb blokuje porty {#how-can-i-check-if-my-isp-blocks-ports}

Chcete-li zjistit, zda je vaše odchozí připojení na portu 25 blokováno, můžete spustit příkaz `telnet smtp.forwardemail.net 25` z příkazového řádku nebo terminálu.