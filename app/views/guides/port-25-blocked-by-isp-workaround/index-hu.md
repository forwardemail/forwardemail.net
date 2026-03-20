# Port 25 blokkolása az internetszolgáltató által – megoldás {#port-25-blocked-by-isp-workaround}


## Tartalomjegyzék {#table-of-contents}

* [Hogyan kerülhető meg az internetszolgáltató által blokkolt bejövő SMTP a 25-ös porton](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Hogyan kerülhető meg az internetszolgáltató által blokkolt kimenő SMTP a 25-ös porton](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Hogyan ellenőrizhetem, hogy az internetszolgáltatóm blokkolja-e a portokat](#how-can-i-check-if-my-isp-blocks-ports)


## Hogyan kerülhető meg az internetszolgáltató által blokkolt bejövő SMTP a 25-ös porton {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Ha nincs nyitva a 25-ös port a levelezőszervered IP-címén, akkor ez az útmutató neked szól.

Például, ha otthon egy egyedi levelezőszervert futtatsz, és az internetszolgáltatód ("ISP") blokkolta a kimenő 25-ös portot.

Mivel nem lehet kimenő forgalom a 25-ös porton, valószínűleg a bejövő forgalom sem fog megérkezni a 25-ös portra ezen blokkolás miatt.

Feltételezve, hogy a szolgáltatásunkat használod e-mailek továbbítására, [ezt a problémát megkerülheted a GYIK válaszunk segítségével itt](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).


## Hogyan kerülhető meg az internetszolgáltató által blokkolt kimenő SMTP a 25-ös porton {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Ha az internetszolgáltatód blokkolja a kimenő 25-ös portot, akkor alternatív megoldást kell találnod, vagy fel kell venni velük a kapcsolatot.


## Hogyan ellenőrizhetem, hogy az internetszolgáltatóm blokkolja-e a portokat {#how-can-i-check-if-my-isp-blocks-ports}

Futtathatod a `telnet smtp.forwardemail.net 25` parancsot a parancssorból vagy terminálból, hogy megnézd, blokkolva van-e a kimenő 25-ös port kapcsolat.
