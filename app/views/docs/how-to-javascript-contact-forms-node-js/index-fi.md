# JavaScript-yhteydenottolomakkeet Node.js-koodiesimerkki {#javascript-contact-forms-nodejs-code-example}


## Sisällysluettelo {#table-of-contents}

* [Asennus ja vaatimukset](#install-and-requirements)
* [Lähdekoodi ja esimerkki](#source-code-and-example)


## Asennus ja vaatimukset {#install-and-requirements}

Sinun tulee asentaa `nodemailer` npm-riippuvuus:

```sh
npm install nodemailer
```


## Lähdekoodi ja esimerkki {#source-code-and-example}

Tämä esimerkki käyttää **[Nodemailer](https://github.com/nodemailer/nodemailer)**-kirjastoa ja sen virallista sponsoria **[Forward Email](https://forwardemail.net)** lähettämään ja esikatsomaan lähtevää sähköpostia.

Sinun tulee <strong class="text-success"><i class="fa fa-key"></i> luoda salasana</strong> lähettääksesi lähtevää sähköpostia – seuraa ystävällisesti ohjeitamme **[Lähetä sähköpostia mukautetulla domainin SMTP:llä -opas](/guides/send-email-with-custom-domain-smtp)**.

<!-- https://github.com/nodemailer/nodemailer-web/pull/22 -->

```js
// app.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.forwardemail.net',
  port: 465,
  secure: true,
  auth: {
    // TODO: korvaa `user` ja `pass` arvot osoitteesta:
    // <https://forwardemail.net/guides/send-email-with-custom-domain-smtp>
    user: 'you@example.com',
    pass: '****************************'
  },
});

await transporter.sendMail({
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hello world',
  html: '<h1>hello world</h1>'
});
```

Suorita sovellus lähettääksesi sähköpostin:

```sh
node app
```

Nyt voit siirtyä kohtaan **[Oma tili → Sähköpostit](/my-account/emails)** nähdäksesi reaaliaikaisen sähköpostin toimitustilanteen, sähköpostin toimitettavuuslokit sekä HTML-/tekstimuotoiset/liitetiedostojen esikatselut.

> P.S. :tada: Voit myös **[esikatsella sähköposteja selaimissa ja iOS-simulaattorissa](/docs/test-preview-email-rendering-browsers-ios-simulator)** ja **[luoda sähköpostipohjia Node.js:llä](/docs/send-emails-with-node-js-javascript)**.
