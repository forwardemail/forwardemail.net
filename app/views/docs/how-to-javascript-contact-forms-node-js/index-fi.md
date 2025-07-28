# JavaScript-yhteydenottolomakkeet Node.js-koodiesimerkki {#javascript-contact-forms-nodejs-code-example}

## Sisällysluettelo {#table-of-contents}

* [Asennus ja vaatimukset](#install-and-requirements)
* [Lähdekoodi ja esimerkki](#source-code-and-example)

## Asennus ja vaatimukset {#install-and-requirements}

Sinun on asennettava `nodemailer` npm -riippuvuus:

```sh
npm install nodemailer
```

## Lähdekoodi ja esimerkki {#source-code-and-example}

Tässä esimerkissä käytetään **[Nodemailer](https://github.com/nodemailer/nodemailer)**-kirjastoa ja sen virallista sponsoria **[Lähetä sähköpostia eteenpäin](https://forwardemail.net)** lähtevän postin lähettämiseen ja esikatseluun.

Sinun on <strong class="text-success"><i class="fa fa-key"></i>luotava salasana</strong> lähettääksesi lähtevää postia – noudata **[Lähetä sähköpostia mukautetulla verkkotunnuksella SMTP-opas](/guides/send-email-with-custom-domain-smtp)**-käytäntöämme.

<!-- https://github.com/nodemailer/nodemailer-web/pull/22 -->

```js
// app.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.forwardemail.net',
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from:
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

Nyt voit siirtyä kohtaan **[Oma tili → Sähköpostit](/my-account/emails)** nähdäksesi reaaliaikaisen sähköpostien toimitustilan, sähköpostien toimituslokit ja HTML-/selkotekstisten/liitteiden esikatselut.

> P.S. :tada: Voit myös käyttää **[esikatsele sähköposteja selaimissa ja iOS-simulaattorissa](/docs/test-preview-email-rendering-browsers-ios-simulator)**- ja **[luo sähköpostipohjia Node.js:llä](/docs/send-emails-with-node-js-javascript)**-merkkejä.