# Az internetszolgáltató által blokkolt 25-ös port megkerülő megoldás {#port-25-blocked-by-isp-workaround}

## Tartalomjegyzék {#table-of-contents}

* [Hogyan lehet megkerülni azt az esetet, ha az internetszolgáltató blokkolja a bejövő SMTP-t a 25-ös porton?](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Hogyan lehet megkerülni az internetszolgáltató által a kimenő SMTP-üzenetek 25-ös porton történő blokkolását](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Hogyan tudom ellenőrizni, hogy az internetszolgáltatóm blokkolja-e a portokat?](#how-can-i-check-if-my-isp-blocks-ports)

## Hogyan lehet megkerülni az internetszolgáltató által a 25-ös porton blokkolt bejövő SMTP-t {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Ha a levelezőszerver IP-címén nincs nyitva a 25-ös port, akkor ez az útmutató Önnek szól.

Például otthon egyéni levelezőszervert futtat, és az internetszolgáltatója („ISP”) blokkolta a 25-ös kimenő portot.

Mivel a 25-ös porton nem lehet kimenő forgalom, valószínűleg a blokkolás miatt bejövő forgalom sem lesz ezen a porton.

Feltételezve, hogy a szolgáltatásunkat használja e-mailek továbbítására, [Ezt a problémát a GYIK válaszunk segítségével kerülheti meg itt](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).

## Hogyan lehet megkerülni az internetszolgáltató által a 25-ös porton blokkolt kimenő SMTP-üzeneteket? {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Ha az internetszolgáltatód blokkolja a 25-ös kimenő portot, akkor alternatív megoldást kell találnod, vagy fel kell venned velük a kapcsolatot.

## Hogyan ellenőrizhetem, hogy az internetszolgáltatóm blokkolja-e a(z) {#how-can-i-check-if-my-isp-blocks-ports}_ portokat?

A `telnet smtp.forwardemail.net 25` parancs futtatásával parancssorból vagy terminálból ellenőrizheted, hogy a kimenő 25-ös porton keresztüli kapcsolat blokkolva van-e.