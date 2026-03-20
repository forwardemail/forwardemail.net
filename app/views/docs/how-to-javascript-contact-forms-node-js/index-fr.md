# Exemple de code Node.js pour formulaires de contact JavaScript {#javascript-contact-forms-nodejs-code-example}


## Table des matières {#table-of-contents}

* [Installation et prérequis](#install-and-requirements)
* [Code source et exemple](#source-code-and-example)


## Installation et prérequis {#install-and-requirements}

Vous devrez installer la dépendance npm `nodemailer` :

```sh
npm install nodemailer
```


## Code source et exemple {#source-code-and-example}

Cet exemple utilise la bibliothèque **[Nodemailer](https://github.com/nodemailer/nodemailer)** et son sponsor officiel **[Forward Email](https://forwardemail.net)** pour envoyer et prévisualiser les mails sortants.

Vous devrez <strong class="text-success"><i class="fa fa-key"></i> Générer un mot de passe</strong> pour envoyer des mails sortants – veuillez suivre notre **[Guide pour envoyer des emails avec SMTP et un domaine personnalisé](/guides/send-email-with-custom-domain-smtp)**.

<!-- https://github.com/nodemailer/nodemailer-web/pull/22 -->

```js
// app.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.forwardemail.net',
  port: 465,
  secure: true,
  auth: {
    // TODO: remplacer les valeurs `user` et `pass` par :
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

Exécutez l’application pour envoyer l’email :

```sh
node app
```

Vous pouvez maintenant aller dans **[Mon compte → Emails](/my-account/emails)** pour voir le statut de livraison de vos emails en temps réel, les journaux de délivrabilité, ainsi que les aperçus HTML/texte brut/pièces jointes.

> P.S. :tada: Vous pouvez aussi **[prévisualiser les emails dans les navigateurs et le simulateur iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** et **[créer des modèles d’email avec Node.js](/docs/send-emails-with-node-js-javascript)**.
