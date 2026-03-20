# Envoyer des e-mails avec un exemple d'application web React.js Node {#send-emails-with-reactjs-node-web-app-example}


## Table des matières {#table-of-contents}

* [Installation et exigences](#install-and-requirements)
* [Code source et exemple](#source-code-and-example)


## Installation et exigences {#install-and-requirements}

Vous devrez installer les dépendances npm `@react-email/render` et `nodemailer` :

```sh
npm install @react-email/render nodemailer
```


## Code source et exemple {#source-code-and-example}

Créez votre modèle d’e-mail avec un fichier `.jsx` ou `.js` :

```jsx
// email.jsx
import * as React from 'react';
import { Html } from '@react-email/html';
import { Button } from '@react-email/button';

export function Email(props) {
  const { url } = props;

  return (
    <Html lang="en">
      <Button href={url}>Visitez notre site web</Button>
    </Html>
  );
}
```

Dans cet exemple, nous utilisons la bibliothèque **[Nodemailer](https://github.com/nodemailer/nodemailer)** et son sponsor officiel **[Forward Email](https://forwardemail.net)** pour envoyer et prévisualiser les mails sortants.

Vous devrez <strong class="text-success"><i class="fa fa-key"></i> Générer un mot de passe</strong> pour envoyer des mails sortants – veuillez suivre notre **[Guide pour envoyer un e-mail avec SMTP et domaine personnalisé](/guides/send-email-with-custom-domain-smtp)**.

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
    // TODO: remplacer les valeurs `user` et `pass` par :
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

Exécutez l’application pour envoyer l’e-mail :

```sh
node app
```

Vous pouvez maintenant aller dans **[Mon compte → E-mails](/my-account/emails)** pour voir le statut de livraison de vos e-mails en temps réel, les journaux de délivrabilité, ainsi que les aperçus HTML/texte brut/pièces jointes.

> P.S. :tada: Vous pouvez aussi **[prévisualiser les e-mails dans les navigateurs et le simulateur iOS](/docs/test-preview-email-rendering-browsers-ios-simulator)** et **[créer des modèles d’e-mails avec Node.js](/docs/send-emails-with-node-js-javascript)**.
