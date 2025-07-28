# Envoyer des e-mails avec l'exemple d'application Web Node React.js {#send-emails-with-reactjs-node-web-app-example}

## Table des matières {#table-of-contents}

* [Installation et exigences](#install-and-requirements)
* [Code source et exemple](#source-code-and-example)

## Installation et configuration requise {#install-and-requirements}

Vous devrez installer les dépendances npm `@react-email/render` et `nodemailer` :

```sh
npm install @react-email/render nodemailer
```

## Code source et exemple {#source-code-and-example}

Créez votre modèle d'e-mail avec un fichier `.jsx` ou `.js` :

```jsx
// email.jsx
import * as React from 'react';
import { Html } from '@react-email/html';
import { Button } from '@react-email/button';

export function Email(props) {
  const { url } = props;

  return (
    <Html lang="en">
      <Button href={url}>Visit our website</Button>
    </Html>
  );
}
```

Dans cet exemple, nous utilisons la bibliothèque **[Nodemailer](https://github.com/nodemailer/nodemailer)** et son sponsor officiel **[Transférer un e-mail](https://forwardemail.net)** pour envoyer et prévisualiser le courrier sortant.

Vous devrez <strong class="text-success"><i class="fa fa-key"></i> Générer un mot de passe</strong> pour envoyer du courrier sortant – veuillez suivre notre **[Guide SMTP pour l'envoi d'e-mails avec un domaine personnalisé](/guides/send-email-with-custom-domain-smtp)**.

<!-- https://github.com/nodemailer/nodemailer-web/pull/22 -->

```js
// app.js
import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import { Email } from './email';

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

const html = render(Email({ url: "https://example.com" }));

const options = {
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hello world',
  html
};

transporter.sendMail(options);
```

Exécutez l'application pour envoyer l'e-mail :

```sh
node app
```

Vous pouvez désormais accéder à **[Mon compte → E-mails](/my-account/emails)** pour voir l'état de livraison de vos e-mails en temps réel, les journaux de délivrabilité des e-mails et les aperçus HTML/texte brut/pièces jointes.

> P.S. :tada: Vous pouvez également **[prévisualiser les e-mails dans les navigateurs et le simulateur iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** et **[créer des modèles d'e-mails avec Node.js](/docs/send-emails-with-node-js-javascript)**.