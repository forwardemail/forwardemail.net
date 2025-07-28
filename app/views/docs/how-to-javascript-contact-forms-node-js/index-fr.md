# Exemple de code Node.js pour les formulaires de contact JavaScript {#javascript-contact-forms-nodejs-code-example}

## Table des matières {#table-of-contents}

* [Installation et exigences](#install-and-requirements)
* [Code source et exemple](#source-code-and-example)

## Installation et configuration requise {#install-and-requirements}

Vous devrez installer la dépendance npm `nodemailer` :

```sh
npm install nodemailer
```

## Code source et exemple {#source-code-and-example}

Cet exemple utilise la bibliothèque **[Nodemailer](https://github.com/nodemailer/nodemailer)** et son sponsor officiel **[Transférer un e-mail](https://forwardemail.net)** pour envoyer et prévisualiser le courrier sortant.

Vous devrez <strong class="text-success"><i class="fa fa-key"></i> Générer un mot de passe</strong> pour envoyer du courrier sortant – veuillez suivre notre **[Guide SMTP pour l'envoi d'e-mails avec un domaine personnalisé](/guides/send-email-with-custom-domain-smtp)**.

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

Exécutez l'application pour envoyer l'e-mail :

```sh
node app
```

Vous pouvez désormais accéder à **[Mon compte → E-mails](/my-account/emails)** pour voir l'état de livraison de vos e-mails en temps réel, les journaux de délivrabilité des e-mails et les aperçus HTML/texte brut/pièces jointes.

> P.S. :tada: Vous pouvez également **[prévisualiser les e-mails dans les navigateurs et le simulateur iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** et **[créer des modèles d'e-mails avec Node.js](/docs/send-emails-with-node-js-javascript)**.