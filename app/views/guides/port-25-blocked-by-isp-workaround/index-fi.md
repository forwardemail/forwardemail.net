# Portti 25 estetty ISP:n toimesta – kiertotapa {#port-25-blocked-by-isp-workaround}


## Sisällysluettelo {#table-of-contents}

* [Kuinka kiertää ISP:n estämä saapuva SMTP-portti 25](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Kuinka kiertää ISP:n estämä lähtevä SMTP-portti 25](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Kuinka voin tarkistaa, estääkö ISP portteja](#how-can-i-check-if-my-isp-blocks-ports)


## Kuinka kiertää ISP:n estämä saapuva SMTP-portti 25 {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Jos portti 25 ei ole auki sähköpostipalvelimesi IP-osoitteessa, tämä opas on sinua varten.

Esimerkiksi, jos käytät kotona omaa sähköpostipalvelinta ja Internet-palveluntarjoajasi ("ISP") on estänyt lähtevän portin 25.

Koska et voi käyttää lähtevää liikennettä portissa 25, todennäköisesti et myöskään saa saapuvaa liikennettä portissa 25 tämän eston vuoksi.

Oletetaan, että käytät palveluamme sähköpostien edelleenlähetykseen, [voit kiertää tämän ongelman FAQ-vastauksemme avulla täällä](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).


## Kuinka kiertää ISP:n estämä lähtevä SMTP-portti 25 {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Jos ISP estää lähtevän portin 25, sinun täytyy löytää vaihtoehtoinen ratkaisu tai ottaa heihin yhteyttä.


## Kuinka voin tarkistaa, estääkö ISP portteja {#how-can-i-check-if-my-isp-blocks-ports}

Voit suorittaa `telnet smtp.forwardemail.net 25` komentoriviltä tai terminaalista nähdäksesi, onko lähtevä portti 25 -yhteytesi estetty.
