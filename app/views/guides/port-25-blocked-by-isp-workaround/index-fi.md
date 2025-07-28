# Internet-palveluntarjoaja esti portin 25 kiertävän vaihtoehdon {#port-25-blocked-by-isp-workaround}

## Sisällysluettelo {#table-of-contents}

* [Kuinka kiertää internet-palveluntarjoajan SMTP-esto portissa 25](#how-to-workaround-isp-blocking-inbound-smtp-on-port-25)
* [Kuinka kiertää internet-palveluntarjoajan lähtevän SMTP:n esto portissa 25](#how-to-workaround-isp-blocking-outbound-smtp-on-port-25)
* [Miten voin tarkistaa, estääkö internet-palveluntarjoajani portteja](#how-can-i-check-if-my-isp-blocks-ports)

## Kuinka kiertää Internet-palveluntarjoajan portissa 25 olevan saapuvan SMTP-liikenteen esto {#how-to-workaround-isp-blocking-inbound-smtp-on-port-25}

Jos sähköpostipalvelimesi IP-osoitteessa ei ole porttia 25 auki, tämä opas on sinua varten.

Esimerkiksi käytät kotona mukautettua sähköpostipalvelinta ja internet-palveluntarjoajasi on estänyt lähtevän postin portin 25.

Koska portissa 25 ei voi olla lähtevää liikennettä, ei portissa todennäköisesti ole myöskään saapuvaa liikennettä tämän eston vuoksi.

Olettaen, että käytät palveluamme sähköpostien edelleenlähettämiseen, [voit kiertää tämän ongelman usein kysyttyjen kysymysten vastauksemme avulla täällä](/faq#can-i-forward-emails-to-ports-other-than-25-eg-if-my-isp-has-blocked-port-25).

## Kuinka kiertää Internet-palveluntarjoajan lähtevän SMTP-liikenteen esto portissa 25 {#how-to-workaround-isp-blocking-outbound-smtp-on-port-25}

Jos internet-palveluntarjoajasi estää lähtevän liikenteen portin 25, sinun on löydettävä vaihtoehtoinen ratkaisu tai otettava heihin yhteyttä.

## Miten voin tarkistaa, estääkö internet-palveluntarjoajani portteja {#how-can-i-check-if-my-isp-blocks-ports}

Voit tarkistaa, onko lähtevän yhteyden portti 25 estetty, ajamalla `telnet smtp.forwardemail.net 25`-komennon komentoriviltä tai päätteeltä.