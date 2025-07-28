# Port 25 zablokowany przez dostawcę usług internetowych, obejście problemu {#port-25-blocked-by-isp-workaround}

## Spis treści {#table-of-contents}

* [Jak obejść blokadę przychodzącego SMTP na porcie 25 przez dostawcę usług internetowych](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Jak obejść blokadę wychodzącego SMTP na porcie 25 przez dostawcę usług internetowych](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Jak mogę sprawdzić, czy mój dostawca usług internetowych blokuje porty?](#how-can-i-check-if-my-isp-blocks-ports)

## Jak obejść blokadę przychodzącego ruchu SMTP na porcie 25 przez dostawcę usług internetowych {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Jeżeli na Twoim serwerze pocztowym nie jest otwarty port 25, to ten przewodnik jest dla Ciebie.

Na przykład, jeśli posiadasz w domu własny serwer pocztowy, Twój dostawca usług internetowych („ISP”) zablokował port wychodzący 25.

Ponieważ nie możesz obsługiwać ruchu wychodzącego na porcie 25, to najprawdopodobniej nie będziesz miał również ruchu przychodzącego na porcie 25 z powodu tej blokady.

Zakładając, że korzystasz z naszej usługi w celu przekazywania wiadomości e-mail, [możesz obejść ten problem korzystając z naszej odpowiedzi na często zadawane pytania tutaj](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).

## Jak obejść blokadę wychodzącego SMTP na porcie 25 przez dostawcę usług internetowych {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Jeśli Twój dostawca usług internetowych blokuje port wychodzący 25, musisz znaleźć alternatywne rozwiązanie lub skontaktować się z nim.

## Jak mogę sprawdzić, czy mój dostawca usług internetowych blokuje porty {#how-can-i-check-if-my-isp-blocks-ports}

Możesz uruchomić `telnet smtp.forwardemail.net 25` z wiersza poleceń lub terminala, aby sprawdzić, czy połączenie wychodzące na porcie 25 jest zablokowane.