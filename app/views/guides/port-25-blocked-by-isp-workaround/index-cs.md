# Port 25 blokován alternativním řešením poskytovatele internetových služeb {#port-25-blocked-by-isp-workaround}

## Obsah {#table-of-contents}

* [Jak obejít blokování příchozích SMTP zpráv poskytovatelem internetových služeb na portu 25](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Jak obejít blokování odchozího SMTP serveru poskytovatelem internetových služeb na portu 25](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Jak mohu zkontrolovat, zda můj poskytovatel internetových služeb blokuje porty](#how-can-i-check-if-my-isp-blocks-ports)

## Jak obejít blokování příchozích SMTP zpráv na portu 25 ze strany poskytovatele internetových služeb {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Pokud nemáte na IP adrese vašeho poštovního serveru otevřený port 25, pak je tento průvodce určen právě vám.

Například máte doma vlastní poštovní server a váš poskytovatel internetových služeb („ISP“) zablokoval odchozí port 25.

Protože na portu 25 nemůžete mít odchozí provoz, pravděpodobně kvůli tomuto bloku na něm nebudete mít ani příchozí provoz.

Za předpokladu, že používáte naši službu k přeposílání e-mailů, [Tento problém můžete vyřešit pomocí odpovědí na naše Často kladené otázky zde](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).

## Jak obejít blokování odchozího SMTP na portu 25 ze strany poskytovatele internetových služeb {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Pokud váš poskytovatel internetových služeb blokuje odchozí port 25, budete muset najít alternativní řešení nebo ho kontaktovat.

## Jak mohu zkontrolovat, zda můj poskytovatel internetových služeb blokuje porty {#how-can-i-check-if-my-isp-blocks-ports}

Můžete spustit příkaz `telnet smtp.forwardemail.net 25` z příkazového řádku nebo terminálu a zjistit, zda je vaše odchozí připojení na portu 25 blokováno.