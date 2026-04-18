# API de Email {#email-api}


## Índice {#table-of-contents}

* [Bibliotecas](#libraries)
* [URI Base](#base-uri)
* [Autenticação](#authentication)
  * [Autenticação por Token API (Recomendado para a maioria dos endpoints)](#api-token-authentication-recommended-for-most-endpoints)
  * [Autenticação por Credenciais de Alias (Para email de saída)](#alias-credentials-authentication-for-outbound-email)
  * [Endpoints Apenas para Alias](#alias-only-endpoints)
* [Erros](#errors)
* [Localização](#localization)
* [Paginação](#pagination)
* [Logs](#logs)
  * [Recuperar logs](#retrieve-logs)
* [Conta](#account)
  * [Criar conta](#create-account)
  * [Recuperar conta](#retrieve-account)
  * [Atualizar conta](#update-account)
* [Contatos de Alias (CardDAV)](#alias-contacts-carddav)
  * [Listar contatos](#list-contacts)
  * [Criar contato](#create-contact)
  * [Recuperar contato](#retrieve-contact)
  * [Atualizar contato](#update-contact)
  * [Excluir contato](#delete-contact)
* [Calendários de Alias (CalDAV)](#alias-calendars-caldav)
  * [Listar calendários](#list-calendars)
  * [Criar calendário](#create-calendar)
  * [Recuperar calendário](#retrieve-calendar)
  * [Atualizar calendário](#update-calendar)
  * [Excluir calendário](#delete-calendar)
* [Mensagens de Alias (IMAP/POP3)](#alias-messages-imappop3)
  * [Listar e buscar mensagens](#list-and-search-for-messages)
  * [Criar mensagem](#create-message)
  * [Recuperar mensagem](#retrieve-message)
  * [Atualizar mensagem](#update-message)
  * [Excluir mensagem](#delete-message)
* [Pastas de Alias (IMAP/POP3)](#alias-folders-imappop3)
  * [Listar pastas](#list-folders)
  * [Criar pasta](#create-folder)
  * [Recuperar pasta](#retrieve-folder)
  * [Atualizar pasta](#update-folder)
  * [Excluir pasta](#delete-folder)
  * [Copiar pasta](#copy-folder)
* [Emails de Saída](#outbound-emails)
  * [Obter limite de email SMTP de saída](#get-outbound-smtp-email-limit)
  * [Listar emails SMTP de saída](#list-outbound-smtp-emails)
  * [Criar email SMTP de saída](#create-outbound-smtp-email)
  * [Recuperar email SMTP de saída](#retrieve-outbound-smtp-email)
  * [Excluir email SMTP de saída](#delete-outbound-smtp-email)
* [Domínios](#domains)
  * [Listar domínios](#list-domains)
  * [Criar domínio](#create-domain)
  * [Recuperar domínio](#retrieve-domain)
  * [Verificar registros de domínio](#verify-domain-records)
  * [Verificar registros SMTP do domínio](#verify-domain-smtp-records)
  * [Listar senhas catch-all para todo o domínio](#list-domain-wide-catch-all-passwords)
  * [Criar senha catch-all para todo o domínio](#create-domain-wide-catch-all-password)
  * [Remover senha catch-all para todo o domínio](#remove-domain-wide-catch-all-password)
  * [Atualizar domínio](#update-domain)
  * [Excluir domínio](#delete-domain)
* [Convites](#invites)
  * [Aceitar convite de domínio](#accept-domain-invite)
  * [Criar convite de domínio](#create-domain-invite)
  * [Remover convite de domínio](#remove-domain-invite)
* [Membros](#members)
  * [Atualizar membro do domínio](#update-domain-member)
  * [Remover membro do domínio](#remove-domain-member)
* [Aliases](#aliases)
  * [Gerar uma senha de alias](#generate-an-alias-password)
  * [Listar aliases de domínio](#list-domain-aliases)
  * [Criar novo alias de domínio](#create-new-domain-alias)
  * [Recuperar alias de domínio](#retrieve-domain-alias)
  * [Atualizar alias de domínio](#update-domain-alias)
  * [Excluir alias de domínio](#delete-domain-alias)
* [Criptografar](#encrypt)
  * [Criptografar Registro TXT](#encrypt-txt-record)


## Bibliotecas {#libraries}

No momento, ainda não lançamos wrappers de API, mas planejamos fazê-lo em breve. Envie um email para <api@forwardemail.net> se desejar ser notificado quando o wrapper da API para uma linguagem de programação específica for lançado. Enquanto isso, você pode usar essas bibliotecas recomendadas para requisições HTTP em sua aplicação, ou simplesmente usar [curl](https://stackoverflow.com/a/27442239/3586413) como nos exemplos abaixo.

| Linguagem | Biblioteca                                                             |
| ---------- | ---------------------------------------------------------------------- |
| Ruby       | [Faraday](https://github.com/lostisland/faraday)                       |
| Python     | [requests](https://github.com/psf/requests)                            |
| Java       | [OkHttp](https://github.com/square/okhttp/)                            |
| PHP        | [guzzle](https://github.com/guzzle/guzzle)                             |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (somos mantenedores) |
| Node.js    | [superagent](https://github.com/ladjs/superagent) (somos mantenedores) |
| Go         | [net/http](https://golang.org/pkg/net/http/)                           |
| .NET       | [RestSharp](https://github.com/restsharp/RestSharp)                    |
## Base URI {#base-uri}

O caminho atual do URI base HTTP é: `BASE_URI`.


## Autenticação {#authentication}

Todos os endpoints requerem autenticação usando [Autorização Básica](https://en.wikipedia.org/wiki/Basic_access_authentication). Suportamos dois métodos de autenticação:

### Autenticação por Token API (Recomendado para a maioria dos endpoints) {#api-token-authentication-recommended-for-most-endpoints}

Defina sua [chave API](https://forwardemail.net/my-account/security) como o valor "username" com uma senha vazia:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

Note o dois pontos (`:`) após o token API – isso indica uma senha vazia no formato Basic Auth.

### Autenticação por Credenciais de Alias (Para email de saída) {#alias-credentials-authentication-for-outbound-email}

O endpoint [Criar email SMTP de saída](#create-outbound-smtp-email) também suporta autenticação usando seu endereço de email alias e uma [senha de alias gerada](/faq#do-you-support-receiving-email-with-imap):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@yourdomain.com:your_generated_password" \
  -d "to=recipient@example.com" \
  -d "subject=Hello" \
  -d "text=Test email"
```

Este método é útil ao enviar emails de aplicações que já usam credenciais SMTP e torna a migração do SMTP para nossa API transparente.

### Endpoints Somente para Alias {#alias-only-endpoints}

Os endpoints [Contatos de Alias](#alias-contacts-carddav), [Calendários de Alias](#alias-calendars-caldav), [Mensagens de Alias](#alias-messages-imappop3) e [Pastas de Alias](#alias-folders-imappop3) requerem credenciais de alias e não suportam autenticação por token API.

Não se preocupe – exemplos são fornecidos abaixo para você caso não saiba o que é isso.


## Erros {#errors}

Se ocorrer algum erro, o corpo da resposta da requisição API conterá uma mensagem de erro detalhada.

| Código | Nome                  |
| ---- | --------------------- |
| 200  | OK                    |
| 400  | Requisição Inválida   |
| 401  | Não Autorizado        |
| 403  | Proibido              |
| 404  | Não Encontrado        |
| 429  | Muitas Requisições    |
| 500  | Erro Interno do Servidor |
| 501  | Não Implementado      |
| 502  | Gateway Ruim          |
| 503  | Serviço Indisponível  |
| 504  | Tempo Esgotado no Gateway |

> \[!TIP]
> Se você receber um código de status 5xx (o que não deveria acontecer), por favor entre em contato conosco em <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> e ajudaremos você a resolver seu problema imediatamente.


## Localização {#localization}

Nosso serviço está traduzido para mais de 25 idiomas diferentes. Todas as mensagens de resposta da API são traduzidas para o último idioma detectado do usuário que faz a requisição API. Você pode sobrescrever isso passando um cabeçalho `Accept-Language` personalizado. Sinta-se à vontade para testar usando o menu de seleção de idioma no rodapé desta página.


## Paginação {#pagination}

> \[!NOTE]
> A partir de 1º de novembro de 2024, os endpoints da API para [Listar domínios](#list-domains) e [Listar aliases de domínio](#list-domain-aliases) terão por padrão `1000` resultados máximos por página. Se desejar optar por esse comportamento antecipadamente, você pode passar `?paginate=true` como um parâmetro adicional na querystring da URL do endpoint.

A paginação é suportada por todos os endpoints da API que listam resultados.

Basta fornecer as propriedades da querystring `page` (e opcionalmente `limit`).

A propriedade `page` deve ser um número maior ou igual a `1`. Se você fornecer `limit` (também um número), o valor mínimo é `10` e o máximo é `50` (a menos que indicado de outra forma).

| Parâmetro da Querystring | Obrigatório | Tipo   | Descrição                                                                                                                                               |
| --------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page`                | Não       | Número | Página de resultados a retornar. Se não especificado, o valor de `page` será `1`. Deve ser um número maior ou igual a `1`.                               |
| `limit`               | Não       | Número | Número de resultados a retornar por página. Padrão é `10` se não especificado. Deve ser um número maior ou igual a `1` e menor ou igual a `50`. |
Para determinar se há mais resultados disponíveis, fornecemos estes cabeçalhos de resposta HTTP (que você pode analisar para paginar programaticamente):

| Cabeçalho de Resposta HTTP | Exemplo                                                                                                                                                                                                                                                  | Descrição                                                                                                                                                                                                                                                                                                                                                        |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `X-Page-Count`             | `X-Page-Count: 3`                                                                                                                                                                                                                                        | A contagem total de páginas disponíveis.                                                                                                                                                                                                                                                                                                                        |
| `X-Page-Current`           | `X-Page-Current: 1`                                                                                                                                                                                                                                      | A página atual de resultados retornada (por exemplo, baseada no parâmetro de querystring `page`).                                                                                                                                                                                                                                                               |
| `X-Page-Size`              | `X-Page-Size: 10`                                                                                                                                                                                                                                        | O número total de resultados na página retornada (por exemplo, baseado no parâmetro de querystring `limit` e nos resultados efetivamente retornados).                                                                                                                                                                                                           |
| `X-Item-Count`             | `X-Item-Count: 30`                                                                                                                                                                                                                                       | O número total de itens disponíveis em todas as páginas.                                                                                                                                                                                                                                                                                                        |
| `Link`                     | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | Fornecemos um cabeçalho de resposta HTTP `Link` que você pode analisar conforme mostrado no exemplo. Isso é [similar ao GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (por exemplo, nem todos os valores serão fornecidos se não forem relevantes ou disponíveis, por exemplo, `"next"` não será fornecido se não houver outra página). |
> Exemplo de Requisição:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```


## Logs {#logs}

### Recuperar logs {#retrieve-logs}

Nossa API permite programaticamente que você baixe logs da sua conta. Enviar uma requisição para este endpoint processará todos os logs da sua conta e os enviará por email como um anexo (arquivo de planilha [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) comprimido com [Gzip](https://en.wikipedia.org/wiki/Gzip)) assim que concluído.

Isso permite que você crie tarefas em segundo plano com um [Cron job](https://en.wikipedia.org/wiki/Cron) ou usando nosso [software de agendamento de tarefas Node.js Bree](https://github.com/breejs/bree) para receber logs sempre que desejar. Note que este endpoint é limitado a `10` requisições por dia.

O anexo tem o formato em minúsculas de `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz` e o próprio email contém um breve resumo dos logs recuperados. Você também pode baixar logs a qualquer momento em [Minha Conta → Logs](/my-account/logs)

> `GET /v1/logs/download`

| Parâmetro Querystring | Obrigatório | Tipo          | Descrição                                                                                                                     |
| --------------------- | ----------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `domain`              | Não         | String (FQDN) | Filtrar logs por domínio totalmente qualificado ("FQDN"). Se não fornecer, todos os logs de todos os domínios serão recuperados. |
| `q`                   | Não         | String        | Buscar logs por email, domínio, nome do alias, endereço IP ou data (formatos `M/Y`, `M/D/YY`, `M-D`, `M-D-YY` ou `M.D.YY`).    |
| `bounce_category`     | Não         | String        | Buscar logs por uma categoria específica de bounce (ex. `blocklist`).                                                          |
| `response_code`       | Não         | Número        | Buscar logs por um código de resposta de erro específico (ex. `421` ou `550`).                                                  |

> Exemplo de Requisição:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Exemplo de Cron job (à meia-noite todo dia):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Note que você pode usar serviços como [Crontab.guru](https://crontab.guru/) para validar a sintaxe da expressão do seu cron job.

> Exemplo de Cron job (à meia-noite todo dia **e com logs do dia anterior**):

Para MacOS:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

Para Linux e Ubuntu:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```


## Conta {#account}

### Criar conta {#create-account}

> `POST /v1/account`

| Parâmetro do Corpo | Obrigatório | Tipo           | Descrição      |
| ------------------ | ----------- | -------------- | -------------- |
| `email`            | Sim         | String (Email) | Endereço de email |
| `password`         | Sim         | String         | Senha          |

> Exemplo de Requisição:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### Recuperar conta {#retrieve-account}

> `GET /v1/account`

> Exemplo de Requisição:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### Atualizar conta {#update-account}

> `PUT /v1/account`

| Parâmetro do Corpo | Obrigatório | Tipo           | Descrição           |
| ------------------ | ----------- | -------------- | ------------------- |
| `email`            | Não         | String (Email) | Endereço de email   |
| `given_name`       | Não         | String         | Primeiro nome       |
| `family_name`      | Não         | String         | Sobrenome           |
| `avatar_url`       | Não         | String (URL)   | Link para imagem do avatar |

> Exemplo de Requisição:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```


## Contatos de Alias (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> Diferente de outros endpoints da API, estes requerem [Autenticação](#authentication) com "username" igual ao nome de usuário do alias e "password" igual à senha gerada do alias como cabeçalhos de Autorização Básica.
> \[!WARNING]
> Esta seção de endpoint está em desenvolvimento e será lançada (esperançosamente) em 2024.  Enquanto isso, por favor use um cliente IMAP no menu "Apps" na navegação do nosso site.

### Listar contatos {#list-contacts}

> `GET /v1/contacts`

**Em breve**

### Criar contato {#create-contact}

> `POST /v1/contacts`

**Em breve**

### Recuperar contato {#retrieve-contact}

> `GET /v1/contacts/:id`

**Em breve**

### Atualizar contato {#update-contact}

> `PUT /v1/contacts/:id`

**Em breve**

### Excluir contato {#delete-contact}

> `DELETE /v1/contacts/:id`

**Em breve**


## Calendários de Alias (CalDAV) {#alias-calendars-caldav}

> \[!NOTE]
> Diferente de outros endpoints da API, estes requerem [Autenticação](#authentication) com "username" igual ao nome de usuário do alias e "password" igual à senha gerada do alias como cabeçalhos de Autorização Básica.

> \[!WARNING]
> Esta seção de endpoint está em desenvolvimento e será lançada (esperançosamente) em 2024.  Enquanto isso, por favor use um cliente IMAP no menu "Apps" na navegação do nosso site.

### Listar calendários {#list-calendars}

> `GET /v1/calendars`

**Em breve**

### Criar calendário {#create-calendar}

> `POST /v1/calendars`

**Em breve**

### Recuperar calendário {#retrieve-calendar}

> `GET /v1/calendars/:id`

**Em breve**

### Atualizar calendário {#update-calendar}

> `PUT /v1/calendars/:id`

**Em breve**

### Excluir calendário {#delete-calendar}

> `DELETE /v1/calendars/:id`

**Em breve**


## Mensagens de Alias (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> Diferente de outros endpoints da API, estes requerem [Autenticação](#authentication) com "username" igual ao nome de usuário do alias e "password" igual à senha gerada do alias como cabeçalhos de Autorização Básica.

> \[!WARNING]
> Esta seção de endpoint está em desenvolvimento e será lançada (esperançosamente) em 2024.  Enquanto isso, por favor use um cliente IMAP no menu "Apps" na navegação do nosso site.

Por favor, certifique-se de que você seguiu as instruções de configuração para seu domínio.

Estas instruções podem ser encontradas na seção FAQ [Você suporta receber email com IMAP?](/faq#do-you-support-receiving-email-with-imap).

### Listar e buscar mensagens {#list-and-search-for-messages}

> `GET /v1/messages`

**Em breve**

### Criar mensagem {#create-message}

> \[!NOTE]
> Isto **NÃO** enviará um email – apenas adicionará a mensagem à sua pasta de caixa de correio (por exemplo, isso é similar ao comando IMAP `APPEND`).  Se você deseja enviar um email, veja [Criar email SMTP de saída](#create-outbound-smtp-email) abaixo.  Após criar o email SMTP de saída, você pode anexar uma cópia dele usando este endpoint à caixa de correio do seu alias para fins de armazenamento.

> `POST /v1/messages`

**Em breve**

### Recuperar mensagem {#retrieve-message}

> `GET /v1/messages/:id`

**Em breve**

### Atualizar mensagem {#update-message}

> `PUT /v1/messages/:id`

**Em breve**

### Excluir mensagem {#delete-message}

> `DELETE /v1/messages:id`

**Em breve**


## Pastas de Alias (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Endpoints de pasta com o caminho da pasta <code>/v1/folders/:path</code> como seu endpoint são intercambiáveis com o ID da pasta <code>:id</code>. Isso significa que você pode se referir à pasta pelo seu <code>path</code> ou <code>id</code>.

> \[!WARNING]
> Esta seção de endpoint está em desenvolvimento e será lançada (esperançosamente) em 2024.  Enquanto isso, por favor use um cliente IMAP no menu "Apps" na navegação do nosso site.

### Listar pastas {#list-folders}

> `GET /v1/folders`

**Em breve**

### Criar pasta {#create-folder}

> `POST /v1/folders`

**Em breve**

### Recuperar pasta {#retrieve-folder}

> `GET /v1/folders/:id`

**Em breve**

### Atualizar pasta {#update-folder}

> `PUT /v1/folders/:id`

**Em breve**

### Excluir pasta {#delete-folder}

> `DELETE /v1/folders/:id`

**Em breve**

### Copiar pasta {#copy-folder}

> `POST /v1/folders/:id/copy`

**Em breve**


## Emails de Saída {#outbound-emails}

Por favor, certifique-se de que você seguiu as instruções de configuração para seu domínio.

Estas instruções podem ser encontradas em [Minha Conta → Domínios → Configurações → Configuração SMTP de Saída](/my-account/domains).  Você precisa garantir a configuração de DKIM, Return-Path e DMARC para enviar SMTP de saída com seu domínio.
### Obter limite de email SMTP de saída {#get-outbound-smtp-email-limit}

Este é um endpoint simples que retorna um objeto JSON contendo o `count` e o `limit` para o número diário de mensagens SMTP de saída por conta.

> `GET /v1/emails/limit`

> Exemplo de Requisição:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Listar emails SMTP de saída {#list-outbound-smtp-emails}

Observe que este endpoint não retorna valores das propriedades do `message`, `headers` nem `rejectedErrors` de um email.

Para retornar essas propriedades e seus valores, use o endpoint [Recuperar email](#retrieve-email) com um ID de email.

> `GET /v1/emails`

| Parâmetro Querystring | Obrigatório | Tipo                      | Descrição                                                                                                                                      |
| --------------------- | ----------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | Não         | String (RegExp suportado) | Pesquisa emails por metadados                                                                                                                    |
| `domain`              | Não         | String (RegExp suportado) | Pesquisa emails por nome de domínio                                                                                                             |
| `sort`                | Não         | String                    | Ordena por um campo específico (prefixe com um hífen único `-` para ordenar na direção inversa desse campo). Padrão é `created_at` se não definido. |
| `page`                | Não         | Número                    | Veja [Paginação](#pagination) para mais detalhes                                                                                               |
| `limit`               | Não         | Número                    | Veja [Paginação](#pagination) para mais detalhes                                                                                               |

> Exemplo de Requisição:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Criar email SMTP de saída {#create-outbound-smtp-email}

Nossa API para criar um email é inspirada e utiliza a configuração de opções de mensagem do Nodemailer. Por favor, consulte a [configuração de mensagem do Nodemailer](https://nodemailer.com/message/) para todos os parâmetros do corpo abaixo.

Observe que, com exceção de `envelope` e `dkim` (já que configuramos automaticamente para você), suportamos todas as opções do Nodemailer. Definimos automaticamente as opções `disableFileAccess` e `disableUrlAccess` como `true` por motivos de segurança.

Você deve passar ou a única opção `raw` com seu email completo bruto incluindo cabeçalhos **ou** passar as opções individuais de parâmetros do corpo abaixo.

Este endpoint da API codificará automaticamente emojis para você se forem encontrados nos cabeçalhos (por exemplo, uma linha de assunto `Subject: 🤓 Hello` é convertida automaticamente para `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello`). Nosso objetivo foi criar uma API de email extremamente amigável para desenvolvedores e à prova de erros.

**Autenticação:** Este endpoint suporta tanto [autenticação por token de API](#api-token-authentication-recommended-for-most-endpoints) quanto [autenticação por credenciais de alias](#alias-credentials-authentication-for-outbound-email). Veja a seção [Autenticação](#authentication) acima para detalhes.

> `POST /v1/emails`

| Parâmetro do Corpo | Obrigatório | Tipo             | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------------ | ----------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`             | Não         | String (Email)   | O endereço de email do remetente (deve existir como um alias do domínio).                                                                                                                                                                                                                                                                                                                                                                                      |
| `to`               | Não         | String ou Array  | Lista separada por vírgulas ou um Array de destinatários para o cabeçalho "To".                                                                                                                                                                                                                                                                                                                                                                                |
| `cc`               | Não         | String ou Array  | Lista separada por vírgulas ou um Array de destinatários para o cabeçalho "Cc".                                                                                                                                                                                                                                                                                                                                                                                |
| `bcc`              | Não         | String ou Array  | Lista separada por vírgulas ou um Array de destinatários para o cabeçalho "Bcc".                                                                                                                                                                                                                                                                                                                                                                               |
| `subject`          | Não         | String           | O assunto do email.                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `text`             | Não         | String ou Buffer | A versão em texto simples da mensagem.                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `html`             | Não         | String ou Buffer | A versão HTML da mensagem.                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `attachments`      | Não         | Array            | Um array de objetos de anexos (veja os [campos comuns do Nodemailer](https://nodemailer.com/message/#common-fields)).                                                                                                                                                                                                                                                                                                                                           |
| `sender`           | Não         | String           | O endereço de email para o cabeçalho "Sender" (veja os [campos mais avançados do Nodemailer](https://nodemailer.com/message/#more-advanced-fields)).                                                                                                                                                                                                                                                                                                          |
| `replyTo`          | Não         | String           | O endereço de email para o cabeçalho "Reply-To".                                                                                                                                                                                                                                                                                                                                                                                                               |
| `inReplyTo`        | Não         | String           | O Message-ID ao qual a mensagem está respondendo.                                                                                                                                                                                                                                                                                                                                                                                                              |
| `references`       | Não         | String ou Array  | Lista separada por espaços ou um Array de Message-IDs.                                                                                                                                                                                                                                                                                                                                                                                                          |
| `attachDataUrls`   | Não         | Boolean          | Se `true`, converte imagens `data:` no conteúdo HTML da mensagem em anexos incorporados.                                                                                                                                                                                                                                                                                                                                                                        |
| `watchHtml`        | Não         | String           | Uma versão HTML específica para Apple Watch da mensagem ([de acordo com a documentação do Nodemailer](https://nodemailer.com/message/#content-options]), os relógios mais recentes não exigem que isso seja definido).                                                                                                                                                                                                                                           |
| `amp`              | Não         | String           | Uma versão HTML específica AMP4EMAIL da mensagem (veja o [exemplo do Nodemailer](https://nodemailer.com/message/#amp-example)).                                                                                                                                                                                                                                                                                                                                |
| `icalEvent`        | Não         | Object           | Um evento iCalendar para usar como conteúdo alternativo da mensagem (veja os [eventos de calendário do Nodemailer](https://nodemailer.com/message/calendar-events/)).                                                                                                                                                                                                                                                                                          |
| `alternatives`     | Não         | Array            | Um Array de conteúdos alternativos da mensagem (veja os [conteúdos alternativos do Nodemailer](https://nodemailer.com/message/alternatives/)).                                                                                                                                                                                                                                                                                                                 |
| `encoding`         | Não         | String           | Codificação para as strings de texto e HTML (padrão é `"utf-8"`, mas também suporta valores de codificação `"hex"` e `"base64"`).                                                                                                                                                                                                                                                                                                                              |
| `raw`              | Não         | String ou Buffer | Uma mensagem formatada RFC822 gerada customizadamente para usar (em vez de uma gerada pelo Nodemailer – veja a [fonte customizada do Nodemailer](https://nodemailer.com/message/custom-source/)).                                                                                                                                                                                                                                                               |
| `textEncoding`     | Não         | String           | Codificação que é forçada a ser usada para valores de texto (ou `"quoted-printable"` ou `"base64"`). O valor padrão é o valor mais próximo detectado (para ASCII use `"quoted-printable"`).                                                                                                                                                                                                                                                                     |
| `priority`         | Não         | String           | Nível de prioridade para o email (pode ser `"high"`, `"normal"` (padrão) ou `"low"`). Note que um valor `"normal"` não define um cabeçalho de prioridade (este é o comportamento padrão). Se um valor `"high"` ou `"low"` for definido, os cabeçalhos `X-Priority`, `X-MSMail-Priority` e `Importance` [serão definidos conforme](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers`          | Não         | Object ou Array  | Um Objeto ou um Array de campos de cabeçalho adicionais para definir (veja os [cabeçalhos customizados do Nodemailer](https://nodemailer.com/message/custom-headers/)).                                                                                                                                                                                                                                                                                         |
| `messageId`        | Não         | String           | Um valor opcional de Message-ID para o cabeçalho "Message-ID" (um valor padrão será criado automaticamente se não definido – note que o valor deve [aderir à especificação RFC2822](https://stackoverflow.com/a/4031705)).                                                                                                                                                                                                                                        |
| `date`             | Não         | String ou Date   | Um valor opcional de Data que será usado se o cabeçalho Date estiver ausente após o parsing, caso contrário a string UTC atual será usada se não definido. O cabeçalho de data não pode ser mais de 30 dias à frente do tempo atual.                                                                                                                                                                                                                           |
| `list`             | Não         | Object           | Um Objeto opcional de cabeçalhos `List-*` (veja os [cabeçalhos de lista do Nodemailer](https://nodemailer.com/message/list-headers/)).                                                                                                                                                                                                                                                                                                                         |
> Exemplo de Requisição (Token API):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Exemplo de Requisição (Credenciais do Alias):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@DOMAIN_NAME:GENERATED_PASSWORD" \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Exemplo de Requisição (Email Bruto):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Recuperar email SMTP de saída {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> Exemplo de Requisição:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Excluir email SMTP de saída {#delete-outbound-smtp-email}

A exclusão do email definirá o status para `"rejected"` (e subsequentemente não o processará na fila) se e somente se o status atual for um dos seguintes: `"pending"`, `"queued"` ou `"deferred"`. Podemos purgar emails automaticamente após 30 dias da sua criação e/ou envio – portanto, você deve manter uma cópia dos emails SMTP de saída em seu cliente, banco de dados ou aplicação. Você pode referenciar nosso valor de ID do email em seu banco de dados, se desejar – este valor é retornado tanto nos endpoints [Criar email](#create-email) quanto [Recuperar email](#retrieve-email).

> `DELETE /v1/emails/:id`

> Exemplo de Requisição:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```


## Domínios {#domains}

> \[!TIP]
> Endpoints de domínio com o nome do domínio <code>/v1/domains/:domain_name</code> como seu endpoint são intercambiáveis com o ID do domínio <code>:domain_id</code>. Isso significa que você pode se referir ao domínio pelo seu <code>name</code> ou <code>id</code>.

### Listar domínios {#list-domains}

> \[!NOTE]
> A partir de 1º de novembro de 2024, os endpoints da API para [Listar domínios](#list-domains) e [Listar aliases de domínio](#list-domain-aliases) terão como padrão `1000` resultados máximos por página. Se desejar optar por esse comportamento antecipadamente, você pode passar `?paginate=true` como um parâmetro adicional na querystring da URL para a consulta do endpoint. Veja [Paginação](#pagination) para mais detalhes.

> `GET /v1/domains`

| Parâmetro da Querystring | Obrigatório | Tipo                      | Descrição                                                                                                                                      |
| ------------------------ | ----------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`                      | Não         | String (RegExp suportado) | Buscar domínios pelo nome                                                                                                                     |
| `name`                   | Não         | String (RegExp suportado) | Buscar domínios pelo nome                                                                                                                     |
| `sort`                   | Não         | String                    | Ordenar por um campo específico (prefixe com um hífen `-` para ordenar na direção inversa desse campo). Padrão é `created_at` se não definido. |
| `page`                   | Não         | Número                    | Veja [Paginação](#pagination) para mais detalhes                                                                                              |
| `limit`                  | Não         | Número                    | Veja [Paginação](#pagination) para mais detalhes                                                                                              |

> Exemplo de Requisição:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Criar domínio {#create-domain}

> `POST /v1/domains`

| Parâmetro do Corpo             | Obrigatório | Tipo                                          | Descrição                                                                                                                                                                                                                                                                                                          |
| ----------------------------- | ----------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain`                      | Sim         | String (FQDN ou IP)                           | Nome de domínio totalmente qualificado ("FQDN") ou endereço IP                                                                                                                                                                                                                                                     |
| `team_domain`                 | Não         | String (ID do domínio ou nome do domínio; FQDN) | Atribuir automaticamente este domínio ao mesmo time de outro domínio. Isso significa que todos os membros deste domínio serão atribuídos como membros do time, e o `plan` será automaticamente definido como `team`. Você pode definir como `"none"` se necessário para desabilitar explicitamente isso, mas não é necessário. |
| `plan`                        | Não         | String (enumerável)                           | Tipo de plano (deve ser `"free"`, `"enhanced_protection"` ou `"team"`, padrão é `"free"` ou o plano pago atual do usuário, se houver)                                                                                                                                                                            |
| `catchall`                    | Não         | String (endereços de email delimitados) ou Boolean | Criar um alias catch-all padrão, padrão é `true` (se `true` usará o endereço de email do usuário da API como destinatário, e se `false` nenhum catch-all será criado). Se for passada uma String, será uma lista delimitada de endereços de email para usar como destinatários (separados por quebra de linha, espaço e/ou vírgula)     |
| `has_adult_content_protection`| Não         | Boolean                                       | Se deve ativar a proteção de conteúdo adulto do Spam Scanner neste domínio                                                                                                                                                                                                                                         |
| `has_phishing_protection`     | Não         | Boolean                                       | Se deve ativar a proteção contra phishing do Spam Scanner neste domínio                                                                                                                                                                                                                                            |
| `has_executable_protection`   | Não         | Boolean                                       | Se deve ativar a proteção contra executáveis do Spam Scanner neste domínio                                                                                                                                                                                                                                        |
| `has_virus_protection`        | Não         | Boolean                                       | Se deve ativar a proteção contra vírus do Spam Scanner neste domínio                                                                                                                                                                                                                                              |
| `has_recipient_verification`  | Não         | Boolean                                       | Padrão global do domínio para exigir que destinatários de alias cliquem em um link de verificação de email para que os emails sejam encaminhados                                                                                                                                                                 |
| `ignore_mx_check`             | Não         | Boolean                                       | Se deve ignorar a verificação do registro MX no domínio para verificação. Isso é principalmente para usuários que possuem regras avançadas de configuração de troca MX e precisam manter sua troca MX existente e encaminhar para a nossa.                                                                        |
| `retention_days`              | Não         | Número                                        | Inteiro entre `0` e `30` que corresponde ao número de dias de retenção para armazenar emails SMTP de saída após entrega bem-sucedida ou erro permanente. Padrão é `0`, o que significa que os emails SMTP de saída são purgados e redigidos imediatamente para sua segurança.                                      |
| `bounce_webhook`              | Não         | String (URL) ou Boolean (false)               | URL webhook `http://` ou `https://` de sua escolha para enviar webhooks de bounce. Enviaremos uma requisição `POST` para essa URL com informações sobre falhas SMTP de saída (ex.: falhas suaves ou duras – para que você possa gerenciar seus assinantes e gerenciar programaticamente seu email de saída).          |
| `max_quota_per_alias`         | Não         | String                                        | Quota máxima de armazenamento para aliases neste nome de domínio. Insira um valor como "1 GB" que será interpretado por [bytes](https://github.com/visionmedia/bytes.js).                                                                                                                                         |
> Exemplo de Solicitação:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Recuperar domínio {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> Exemplo de Solicitação:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Verificar registros do domínio {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Exemplo de Solicitação:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Verificar registros SMTP do domínio {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Exemplo de Solicitação:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### Listar senhas catch-all para todo o domínio {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Exemplo de Solicitação:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Criar senha catch-all para todo o domínio {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Parâmetro do Corpo | Obrigatório | Tipo   | Descrição                                                                                                                                                                                                               |
| ------------------ | ----------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password`     | Não         | String | Sua nova senha personalizada para usar como senha catch-all para todo o domínio. Note que você pode deixar este campo em branco ou ausente no corpo da requisição API se desejar obter uma senha forte gerada aleatoriamente.  As senhas personalizadas para caixas de correio devem ter até 128 caracteres, não podem começar ou terminar com espaço em branco e não podem conter aspas ou apóstrofos. Senhas catch-all são apenas para envio SMTP. Para IMAP, POP3, CalDAV, CardDAV e acesso à caixa de correio, gere uma senha para o alias específico. |
| `description`      | Não         | String | Descrição apenas para fins de organização.                                                                                                                                                                             |

> Exemplo de Solicitação:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Remover senha catch-all para todo o domínio {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Exemplo de Solicitação:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Atualizar domínio {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Parâmetro do Corpo             | Obrigatório | Tipo                            | Descrição                                                                                                                                                                                                                                                                                   |
| ----------------------------- | ----------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port`                   | Não         | String ou Número                | Porta personalizada para configurar o encaminhamento SMTP (padrão é `"25"`)                                                                                                                                                                                                                  |
| `has_adult_content_protection`| Não         | Boolean                        | Se deve ativar a proteção contra conteúdo adulto do Spam Scanner neste domínio                                                                                                                                                                                                              |
| `has_phishing_protection`     | Não         | Boolean                        | Se deve ativar a proteção contra phishing do Spam Scanner neste domínio                                                                                                                                                                                                                     |
| `has_executable_protection`   | Não         | Boolean                        | Se deve ativar a proteção contra executáveis do Spam Scanner neste domínio                                                                                                                                                                                                                 |
| `has_virus_protection`        | Não         | Boolean                        | Se deve ativar a proteção contra vírus do Spam Scanner neste domínio                                                                                                                                                                                                                       |
| `has_recipient_verification`  | Não         | Boolean                        | Padrão global do domínio para exigir que destinatários de alias cliquem em um link de verificação de email para que os emails sejam encaminhados                                                                                                                                           |
| `ignore_mx_check`             | Não         | Boolean                        | Se deve ignorar a verificação do registro MX no domínio para verificação. Isso é principalmente para usuários que possuem regras avançadas de configuração de troca MX e precisam manter sua troca MX existente e encaminhar para a nossa.                                               |
| `retention_days`              | Não         | Número                         | Inteiro entre `0` e `30` que corresponde ao número de dias de retenção para armazenar emails SMTP de saída após entrega bem-sucedida ou erro permanente. O padrão é `0`, o que significa que os emails SMTP de saída são apagados e redigidos imediatamente para sua segurança.          |
| `bounce_webhook`              | Não         | String (URL) ou Boolean (false) | A URL webhook `http://` ou `https://` de sua escolha para enviar webhooks de bounce. Enviaremos uma requisição `POST` para essa URL com informações sobre falhas SMTP de saída (ex.: falhas suaves ou duras – para que você possa gerenciar seus assinantes e gerenciar programaticamente seu email de saída). |
| `max_quota_per_alias`         | Não         | String                         | Quota máxima de armazenamento para aliases neste nome de domínio. Insira um valor como "1 GB" que será interpretado por [bytes](https://github.com/visionmedia/bytes.js).                                                                                                                  |
> Exemplo de Requisição:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Excluir domínio {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> Exemplo de Requisição:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```


## Convites {#invites}

### Aceitar convite de domínio {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Exemplo de Requisição:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Criar convite de domínio {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Parâmetro do Corpo | Obrigatório | Tipo                | Descrição                                                                               |
| ------------------ | ----------- | ------------------- | --------------------------------------------------------------------------------------- |
| `email`            | Sim         | String (Email)      | Endereço de email para convidar para a lista de membros do domínio                      |
| `group`            | Sim         | String (enumerável) | Grupo para adicionar o usuário na associação do domínio (pode ser um dos valores `"admin"` ou `"user"`) |

> Exemplo de Requisição:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> Se o usuário convidado já for um membro aceito de qualquer outro domínio do qual o administrador que o convida seja membro, o convite será aceito automaticamente e nenhum email será enviado.

### Remover convite de domínio {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Parâmetro do Corpo | Obrigatório | Tipo           | Descrição                                      |
| ------------------ | ----------- | -------------- | ---------------------------------------------- |
| `email`            | Sim         | String (Email) | Endereço de email para remover da lista de membros do domínio |

> Exemplo de Requisição:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```


## Membros {#members}

### Atualizar membro do domínio {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Parâmetro do Corpo | Obrigatório | Tipo                | Descrição                                                                                  |
| ------------------ | ----------- | ------------------- | ------------------------------------------------------------------------------------------ |
| `group`            | Sim         | String (enumerável) | Grupo para atualizar o usuário na associação do domínio (pode ser um dos valores `"admin"` ou `"user"`) |

> Exemplo de Requisição:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Remover membro do domínio {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Exemplo de Requisição:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```


## Apelidos {#aliases}

### Gerar uma senha para apelido {#generate-an-alias-password}

Note que se você não enviar instruções por email, o nome de usuário e a senha estarão no corpo da resposta JSON de uma requisição bem-sucedida no formato `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Parâmetro do Corpo    | Obrigatório | Tipo    | Descrição                                                                                                                                                                                                                                                                                         |
| --------------------- | ----------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password`        | Não         | String  | Sua nova senha personalizada para usar no apelido. Note que você pode deixar este campo em branco ou ausente no corpo da requisição API se desejar obter uma senha forte gerada aleatoriamente.                                                                                                   As senhas personalizadas para caixas de correio devem ter até 128 caracteres, não podem começar ou terminar com espaço em branco e não podem conter aspas ou apóstrofos. |
| `password`            | Não         | String  | Senha existente do apelido para alterar a senha sem deletar o armazenamento IMAP existente (veja a opção `is_override` abaixo se você não tiver mais a senha existente).                                                                                                                         |
| `is_override`         | Não         | Boolean | **USE COM CAUTELA**: Isso irá sobrescrever completamente a senha e o banco de dados do apelido existente, apagando permanentemente o armazenamento IMAP existente e resetando completamente o banco de dados SQLite de email do apelido. Faça um backup se possível caso tenha uma caixa de correio associada a este apelido. |
| `emailed_instructions`| Não         | String  | Endereço de email para enviar a senha do apelido e as instruções de configuração.                                                                                                                                                                                                                 |
> Exemplo de Requisição:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Listar aliases de domínio {#list-domain-aliases}

> \[!NOTE]
> A partir de 1º de novembro de 2024, os endpoints da API para [Listar domínios](#list-domains) e [Listar aliases de domínio](#list-domain-aliases) terão como padrão `1000` resultados máximos por página. Se você quiser optar por esse comportamento antecipadamente, pode passar `?paginate=true` como um parâmetro adicional na querystring da URL para a consulta do endpoint. Veja [Paginação](#pagination) para mais detalhes.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Parâmetro da Querystring | Obrigatório | Tipo                      | Descrição                                                                                                                                      |
| ------------------------ | ----------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`                      | Não         | String (RegExp suportado) | Buscar aliases em um domínio por nome, etiqueta ou destinatário                                                                               |
| `name`                   | Não         | String (RegExp suportado) | Buscar aliases em um domínio por nome                                                                                                         |
| `recipient`              | Não         | String (RegExp suportado) | Buscar aliases em um domínio por destinatário                                                                                                |
| `sort`                   | Não         | String                    | Ordenar por um campo específico (prefixar com um hífen único `-` para ordenar na direção inversa desse campo). Padrão é `created_at` se não definido. |
| `page`                   | Não         | Número                    | Veja [Paginação](#pagination) para mais detalhes                                                                                              |
| `limit`                  | Não         | Número                    | Veja [Paginação](#pagination) para mais detalhes                                                                                              |

> Exemplo de Requisição:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Criar novo alias de domínio {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Parâmetro do Corpo               | Obrigatório | Tipo                                   | Descrição                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------- | ----------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | Não         | String                               | Nome do alias (se não fornecido ou estiver em branco, um alias aleatório será gerado)                                                                                                                                                                                                                                                                                                      |
| `recipients`                    | Não         | String ou Array                      | Lista de destinatários (deve ser uma String separada por quebras de linha/espaço/vírgula ou Array de endereços de email válidos, nomes de domínio totalmente qualificados ("FQDN"), endereços IP e/ou URLs de webhook – e se não fornecido ou for um Array vazio, o email do usuário que está fazendo a requisição API será definido como destinatário)                                                                                     |
| `description`                   | Não         | String                               | Descrição do alias                                                                                                                                                                                                                                                                                                                                                                        |
| `labels`                        | Não         | String ou Array                      | Lista de etiquetas (deve ser uma String separada por quebras de linha/espaço/vírgula ou Array)                                                                                                                                                                                                                                                                                             |
| `has_recipient_verification`    | Não         | Boolean                              | Exigir que destinatários cliquem em um link de verificação por email para que os emails sejam encaminhados (padrão é a configuração do domínio se não definido explicitamente no corpo da requisição)                                                                                                                                                                                      |
| `is_enabled`                    | Não         | Boolean                              | Se deve habilitar ou desabilitar este alias (se desabilitado, os emails não serão encaminhados para lugar algum, mas retornarão códigos de status de sucesso). Se um valor for passado, ele será convertido para boolean usando [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                                                           |
| `error_code_if_disabled`        | Não         | Número (pode ser `250`, `421` ou `550`) | Email recebido para este alias será rejeitado se `is_enabled` for `false` com código `250` (entrega silenciosa para lugar nenhum, ex: buraco negro ou `/dev/null`), `421` (rejeição temporária; e tentativas por até ~5 dias) ou `550` (falha permanente e rejeição). Padrão é `250`.                                                                                                   |
| `has_imap`                      | Não         | Boolean                              | Se deve habilitar ou desabilitar armazenamento IMAP para este alias (se desabilitado, emails recebidos não serão armazenados no [armazenamento IMAP](/blog/docs/best-quantum-safe-encrypted-email-service). Se um valor for passado, ele será convertido para boolean usando [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                  |
| `has_pgp`                       | Não         | Boolean                              | Se deve habilitar ou desabilitar [criptografia OpenPGP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) para [armazenamento de email criptografado IMAP/POP3/CalDAV/CardDAV](/blog/docs/best-quantum-safe-encrypted-email-service) usando a `public_key` do alias.                                                                                         |
| `public_key`                    | Não         | String                               | Chave pública OpenPGP em formato ASCII Armor ([clique aqui para ver um exemplo](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); ex: chave GPG para `support@forwardemail.net`). Isso só se aplica se `has_pgp` estiver definido como `true`. [Saiba mais sobre criptografia de ponta a ponta em nosso FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                     | Não         | String                               | Cota máxima de armazenamento para este alias. Deixe em branco para resetar para a cota máxima atual do domínio ou insira um valor como "1 GB" que será interpretado por [bytes](https://github.com/visionmedia/bytes.js). Este valor só pode ser ajustado por administradores do domínio.                                                                                                  |
| `vacation_responder_is_enabled` | Não         | Boolean                              | Se deve habilitar ou desabilitar um respondedor automático de férias.                                                                                                                                                                                                                                                                                                                     |
| `vacation_responder_start_date` | Não         | String                               | Data de início para o respondedor de férias (se habilitado e nenhuma data de início definida aqui, assume-se que já está iniciado). Suportamos formatos de data como `MM/DD/YYYY`, `YYYY-MM-DD` e outros formatos via análise inteligente usando `dayjs`.                                                                                                                                  |
| `vacation_responder_end_date`   | Não         | String                               | Data de término para o respondedor de férias (se habilitado e nenhuma data de término definida aqui, assume-se que nunca termina e responde para sempre). Suportamos formatos de data como `MM/DD/YYYY`, `YYYY-MM-DD` e outros formatos via análise inteligente usando `dayjs`.                                                                                                          |
| `vacation_responder_subject`    | Não         | String                               | Assunto em texto simples para o respondedor de férias, ex: "Fora do Escritório". Usamos `striptags` para remover todo HTML aqui.                                                                                                                                                                                                                                                         |
| `vacation_responder_message`    | Não         | String                               | Mensagem em texto simples para o respondedor de férias, ex: "Estarei fora do escritório até fevereiro.". Usamos `striptags` para remover todo HTML aqui.                                                                                                                                                                                                                                   |
> Exemplo de Requisição:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Recuperar alias de domínio {#retrieve-domain-alias}

Você pode recuperar um alias de domínio pelo seu valor `id` ou `name`.

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> Exemplo de Requisição:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> Exemplo de Requisição:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### Atualizar alias de domínio {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Parâmetro do Corpo             | Obrigatório | Tipo                                   | Descrição                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------------------- | ----------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                        | Não         | String                               | Nome do alias                                                                                                                                                                                                                                                                                                                                                                              |
| `recipients`                  | Não         | String ou Array                      | Lista de destinatários (deve ser uma String separada por quebras de linha/espaços/vírgulas ou um Array de endereços de email válidos, nomes de domínio totalmente qualificados ("FQDN"), endereços IP e/ou URLs de webhook)                                                                                                                                                                   |
| `description`                 | Não         | String                               | Descrição do alias                                                                                                                                                                                                                                                                                                                                                                         |
| `labels`                      | Não         | String ou Array                      | Lista de etiquetas (deve ser uma String separada por quebras de linha/espaços/vírgulas ou um Array)                                                                                                                                                                                                                                                                                         |
| `has_recipient_verification`  | Não         | Boolean                              | Exigir que os destinatários cliquem em um link de verificação por email para que os emails sejam encaminhados (padrão é a configuração do domínio se não definido explicitamente no corpo da requisição)                                                                                                                                                                                     |
| `is_enabled`                  | Não         | Boolean                              | Se deve habilitar ou desabilitar este alias (se desabilitado, os emails não serão encaminhados para lugar algum, mas retornarão códigos de status de sucesso). Se um valor for passado, ele será convertido para boolean usando [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                  |
| `error_code_if_disabled`      | Não         | Número (pode ser `250`, `421` ou `550`) | Email recebido para este alias será rejeitado se `is_enabled` for `false` com código `250` (entrega silenciosa para lugar nenhum, ex: buraco negro ou `/dev/null`), `421` (rejeição temporária; e tentativas por até ~5 dias) ou `550` falha permanente e rejeição. Padrão é `250`.                                                                                                         |
| `has_imap`                    | Não         | Boolean                              | Se deve habilitar ou desabilitar armazenamento IMAP para este alias (se desabilitado, emails recebidos não serão armazenados no [armazenamento IMAP](/blog/docs/best-quantum-safe-encrypted-email-service). Se um valor for passado, ele será convertido para boolean usando [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                        |
| `has_pgp`                     | Não         | Boolean                              | Se deve habilitar ou desabilitar [criptografia OpenPGP](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) para [armazenamento de email criptografado IMAP/POP3/CalDAV/CardDAV](/blog/docs/best-quantum-safe-encrypted-email-service) usando a `public_key` do alias.                                                                                             |
| `public_key`                  | Não         | String                               | Chave pública OpenPGP em formato ASCII Armor ([clique aqui para ver um exemplo](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); ex: chave GPG para `support@forwardemail.net`). Aplica-se somente se `has_pgp` estiver definido como `true`. [Saiba mais sobre criptografia de ponta a ponta em nosso FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                   | Não         | String                               | Cota máxima de armazenamento para este alias. Deixe em branco para resetar para a cota máxima atual do domínio ou insira um valor como "1 GB" que será interpretado por [bytes](https://github.com/visionmedia/bytes.js). Este valor só pode ser ajustado por administradores do domínio.                                                                                                   |
| `vacation_responder_is_enabled` | Não       | Boolean                              | Se deve habilitar ou desabilitar um respondedor automático de férias.                                                                                                                                                                                                                                                                                                                     |
| `vacation_responder_start_date` | Não       | String                               | Data de início para o respondedor de férias (se habilitado e nenhuma data de início definida aqui, assume-se que já está iniciado). Suportamos formatos de data como `MM/DD/YYYY`, `YYYY-MM-DD` e outros formatos via análise inteligente usando `dayjs`.                                                                                                                                  |
| `vacation_responder_end_date` | Não         | String                               | Data de término para o respondedor de férias (se habilitado e nenhuma data de término definida aqui, assume-se que nunca termina e responde para sempre). Suportamos formatos de data como `MM/DD/YYYY`, `YYYY-MM-DD` e outros formatos via análise inteligente usando `dayjs`.                                                                                                            |
| `vacation_responder_subject`  | Não         | String                               | Assunto em texto simples para o respondedor de férias, ex: "Fora do Escritório". Usamos `striptags` para remover todo HTML aqui.                                                                                                                                                                                                                                                         |
| `vacation_responder_message`  | Não         | String                               | Mensagem em texto simples para o respondedor de férias, ex: "Estarei fora do escritório até fevereiro.". Usamos `striptags` para remover todo HTML aqui.                                                                                                                                                                                                                                   |
> Exemplo de Requisição:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Excluir alias de domínio {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Exemplo de Requisição:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```


## Criptografar {#encrypt}

Permitimos que você criptografe registros mesmo no plano gratuito sem custo. Privacidade não deve ser um recurso, deve ser inerentemente incorporada a todos os aspectos de um produto. Conforme muito solicitado em uma [discussão do Privacy Guides](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) e em [nossos issues no GitHub](https://github.com/forwardemail/forwardemail.net/issues/254), adicionamos isso.

### Criptografar Registro TXT {#encrypt-txt-record}

> `POST /v1/encrypt`

| Parâmetro do Corpo | Obrigatório | Tipo   | Descrição                                  |
| ------------------ | ----------- | ------ | ------------------------------------------ |
| `input`            | Sim         | String | Qualquer registro TXT de texto simples válido do Forward Email |

> Exemplo de Requisição:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
