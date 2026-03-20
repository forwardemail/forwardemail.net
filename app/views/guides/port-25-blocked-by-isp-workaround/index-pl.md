# Port 25 zablokowany przez ISP - obejście problemu {#port-25-blocked-by-isp-workaround}


## Spis treści {#table-of-contents}

* [Jak obejść blokadę ISP na przychodzący SMTP na porcie 25](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Jak obejść blokadę ISP na wychodzący SMTP na porcie 25](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Jak sprawdzić, czy mój ISP blokuje porty](#how-can-i-check-if-my-isp-blocks-ports)


## Jak obejść blokadę ISP na przychodzący SMTP na porcie 25 {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Jeśli port 25 nie jest otwarty na adresie IP Twojego serwera pocztowego, ten przewodnik jest dla Ciebie.

Na przykład, jeśli prowadzisz własny serwer pocztowy w domu, a Twój Dostawca Usług Internetowych ("ISP") zablokował wychodzący port 25.

Ponieważ nie możesz mieć ruchu wychodzącego na porcie 25, najprawdopodobniej nie będziesz też mieć ruchu przychodzącego na porcie 25 z powodu tej blokady.

Zakładając, że korzystasz z naszej usługi do przekazywania e-maili, [możesz obejść ten problem dzięki naszej odpowiedzi w FAQ tutaj](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).


## Jak obejść blokadę ISP na wychodzący SMTP na porcie 25 {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Jeśli Twój ISP blokuje wychodzący port 25, będziesz musiał znaleźć alternatywne rozwiązanie lub skontaktować się z nimi.


## Jak sprawdzić, czy mój ISP blokuje porty {#how-can-i-check-if-my-isp-blocks-ports}

Możesz uruchomić `telnet smtp.forwardemail.net 25` z linii poleceń lub terminala, aby sprawdzić, czy Twoje wychodzące połączenie na port 25 jest zablokowane.
