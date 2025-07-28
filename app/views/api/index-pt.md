# API de e-mail {#email-api}

## Índice {#table-of-contents}

* [Bibliotecas](#libraries)
* [URI base](#base-uri)
* [Autenticação](#authentication)
* [Erros](#errors)
* [Localização](#localization)
* [Paginação](#pagination)
* [Registros](#logs)
  * [Recuperar logs](#retrieve-logs)
* [Conta](#account)
  * [Criar uma conta](#create-account)
  * [Recuperar conta](#retrieve-account)
  * [Atualizar conta](#update-account)
* [Contatos de Alias (CardDAV)](#alias-contacts-carddav)
  * [Listar contatos](#list-contacts)
  * [Criar contato](#create-contact)
  * [Recuperar contato](#retrieve-contact)
  * [Atualizar contato](#update-contact)
  * [Excluir contato](#delete-contact)
* [Calendários Alias (CalDAV)](#alias-calendars-caldav)
  * [Listar calendários](#list-calendars)
  * [Criar calendário](#create-calendar)
  * [Recuperar calendário](#retrieve-calendar)
  * [Atualizar calendário](#update-calendar)
  * [Excluir calendário](#delete-calendar)
* [Mensagens de alias (IMAP/POP3)](#alias-messages-imappop3)
  * [Listar e pesquisar mensagens](#list-and-search-for-messages)
  * [Criar mensagem](#create-message)
  * [Recuperar mensagem](#retrieve-message)
  * [Mensagem de atualização](#update-message)
  * [Excluir mensagem](#delete-message)
* [Pastas de Alias (IMAP/POP3)](#alias-folders-imappop3)
  * [Listar pastas](#list-folders)
  * [Criar pasta](#create-folder)
  * [Recuperar pasta](#retrieve-folder)
  * [Atualizar pasta](#update-folder)
  * [Excluir pasta](#delete-folder)
  * [Copiar pasta](#copy-folder)
* [E-mails de saída](#outbound-emails)
  * [Obtenha limite de e-mail SMTP de saída](#get-outbound-smtp-email-limit)
  * [Listar e-mails SMTP de saída](#list-outbound-smtp-emails)
  * [Criar e-mail SMTP de saída](#create-outbound-smtp-email)
  * [Recuperar e-mail SMTP de saída](#retrieve-outbound-smtp-email)
  * [Excluir e-mail SMTP de saída](#delete-outbound-smtp-email)
* [Domínios](#domains)
  * [Listar domínios](#list-domains)
  * [Criar domínio](#create-domain)
  * [Recuperar domínio](#retrieve-domain)
  * [Verificar registros de domínio](#verify-domain-records)
  * [Verificar registros SMTP de domínio](#verify-domain-smtp-records)
  * [Listar senhas gerais de todo o domínio](#list-domain-wide-catch-all-passwords)
  * [Crie uma senha abrangente para todo o domínio](#create-domain-wide-catch-all-password)
  * [Remover senha geral de todo o domínio](#remove-domain-wide-catch-all-password)
  * [Atualizar domínio](#update-domain)
  * [Excluir domínio](#delete-domain)
* [Convites](#invites)
  * [Aceitar convite de domínio](#accept-domain-invite)
  * [Criar convite de domínio](#create-domain-invite)
  * [Remover convite de domínio](#remove-domain-invite)
* [Membros](#members)
  * [Atualizar membro do domínio](#update-domain-member)
  * [Remover membro do domínio](#remove-domain-member)
* [Pseudônimos](#aliases)
  * [Gerar uma senha de alias](#generate-an-alias-password)
  * [Listar aliases de domínio](#list-domain-aliases)
  * [Criar novo alias de domínio](#create-new-domain-alias)
  * [Recuperar alias de domínio](#retrieve-domain-alias)
  * [Atualizar alias de domínio](#update-domain-alias)
  * [Excluir alias de domínio](#delete-domain-alias)
* [Criptografar](#encrypt)
  * [Criptografar registro TXT](#encrypt-txt-record)

## Bibliotecas {#libraries}

No momento, ainda não lançamos nenhum wrapper de API, mas planejamos fazê-lo em breve. Envie um e-mail para <api@forwardemail.net> se desejar ser notificado quando o wrapper de API de uma linguagem de programação específica for lançado. Enquanto isso, você pode usar estas bibliotecas de solicitação HTTP recomendadas em seu aplicativo ou simplesmente usar [enrolar](https://stackoverflow.com/a/27442239/3586413) como nos exemplos abaixo.

| Linguagem | Biblioteca |
| ---------- | ---------------------------------------------------------------------- |
| Rubi | [Faraday](https://github.com/lostisland/faraday) |
| Pitão | [requests](https://github.com/psf/requests) |
| Java | [OkHttp](https://github.com/square/okhttp/) |
| PHP | [guzzle](https://github.com/guzzle/guzzle) |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (somos mantenedores) |
| Node.js | [superagent](https://github.com/ladjs/superagent) (somos mantenedores) |
| Ir | [net/http](https://golang.org/pkg/net/http/) |
| .NET | [RestSharp](https://github.com/restsharp/RestSharp) |

## URI base {#base-uri}

O caminho atual do URI base HTTP é: `BASE_URI`.

## Autenticação {#authentication}

Todos os endpoints exigem que seu [Chave de API](https://forwardemail.net/my-account/security) seja definido como o valor "nome de usuário" do cabeçalho [Autorização Básica](https://en.wikipedia.org/wiki/Basic_access_authentication) da solicitação (com exceção de [Contatos de alias](#alias-contacts), [Calendários Alias](#alias-calendars) e [Caixas de correio de alias](#alias-mailboxes) que usam um [nome de usuário e senha de alias gerados](/faq#do-you-support-receiving-email-with-imap)).

Não se preocupe — fornecemos exemplos abaixo para você caso não tenha certeza do que é isso.

## Erros {#errors}

Se ocorrer algum erro, o corpo de resposta da solicitação da API conterá uma mensagem de erro detalhada.

| Código | Nome |
| ---- | --------------------- |
| 200 | OK |
| 400 | Pedido ruim |
| 401 | Não autorizado |
| 403 | Proibido |
| 404 | Não encontrado |
| 429 | Muitas solicitações |
| 500 | Erro do Servidor Interno |
| 501 | Não implementado |
| 502 | Gateway ruim |
| 503 | Serviço não disponível |
| 504 | Tempo limite do gateway |

> \[!TIP]
> If you receive a 5xx status code (which should not happen), then please contact us at <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> and we will help you to resolve your issue immediately.

## Localização {#localization}

Nosso serviço é traduzido para mais de 25 idiomas diferentes. Todas as mensagens de resposta da API são traduzidas para a última localidade detectada do usuário que fez a solicitação. Você pode substituir isso passando um cabeçalho personalizado `Accept-Language`. Sinta-se à vontade para experimentar usando o menu suspenso de idiomas na parte inferior desta página.

## Paginação {#pagination}

> \[!NOTE]
> As of November 1st, 2024 the API endpoints for [List domains](#list-domains) and [List domain aliases](#list-domain-aliases) will default to `1000` max results per page.  If you would like to opt-in to this behavior early, you can pass `?paginate=true` as an additional querystring parameter to the URL for the endpoint query.

A paginação é suportada por todos os endpoints da API que listam resultados.

Basta fornecer as propriedades da string de consulta `page` (e opcionalmente `limit`).

A propriedade `page` deve ser um número maior ou igual a `1`. Se você fornecer `limit` (também um número), o valor mínimo será `10` e o máximo será `50` (salvo indicação em contrário).

| Parâmetros da string de consulta | Obrigatório | Tipo | Descrição |
| --------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page` | Não | Número | Página de resultados a ser retornada. Se não especificado, o valor `page` será `1`. Deve ser um número maior ou igual a `1`. |
| `limit` | Não | Número | Número de resultados a serem retornados por página. O padrão é `10` se não for especificado. Deve ser um número maior ou igual a `1` e menor ou igual a `50`. |

Para determinar se há mais resultados disponíveis, fornecemos estes cabeçalhos de resposta HTTP (que você pode analisar para paginar programaticamente):

| Cabeçalho de resposta HTTP | Exemplo | Descrição |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count` | `X-Page-Count: 3` | Contagem total de páginas disponíveis. |
| `X-Page-Current` | `X-Page-Current: 1` | A página atual de resultados retornados (por exemplo, com base no parâmetro de string de consulta `page`). |
| `X-Page-Size` | `X-Page-Size: 10` | O número total de resultados na página retornados (por exemplo, com base no parâmetro de string de consulta `limit` e nos resultados reais retornados). |
| `X-Item-Count` | `X-Item-Count: 30` | O número total de itens disponíveis em todas as páginas. |
| `Link` | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | Fornecemos um cabeçalho de resposta HTTP `Link` que você pode analisar conforme mostrado no exemplo. Trata-se de [similar to GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (por exemplo, nem todos os valores serão fornecidos se não forem relevantes ou não estiverem disponíveis; por exemplo, `"next"` não será fornecido se não houver outra página). |

> Exemplo de solicitação:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```

## Registros {#logs}

### Recuperar registros {#retrieve-logs}

Nossa API permite que você baixe os logs da sua conta programaticamente. Enviar uma solicitação para este endpoint processará todos os logs da sua conta e os enviará por e-mail como anexo (arquivo de planilha compactado [Gzip](https://en.wikipedia.org/wiki/Gzip) [CSV](https://en.wikipedia.org/wiki/Comma-separated_values)) após a conclusão.

Isso permite que você crie trabalhos em segundo plano com um [Tarefa cron](https://en.wikipedia.org/wiki/Cron) ou usando nosso [Software de agendamento de tarefas Node.js Bree](https://github.com/breejs/bree) para receber logs sempre que desejar. Observe que este endpoint está limitado a `10` solicitações por dia.

O anexo é a forma minúscula de `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz` e o próprio e-mail contém um breve resumo dos logs recuperados. Você também pode baixar os logs a qualquer momento em [Minha conta → Registros](/my-account/logs)

> `GET /v1/logs/download`

| Parâmetros da string de consulta | Obrigatório | Tipo | Descrição |
| --------------------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | Não | Cadeia de caracteres (FQDN) | Filtrar logs por domínio totalmente qualificado ("FQDN"). Se você não fornecer isso, todos os logs de todos os domínios serão recuperados. |
| `q` | Não | Corda | Pesquise logs por e-mail, domínio, nome de alias, endereço IP ou data (formato `M/Y`, `M/D/YY`, `M-D`, `M-D-YY` ou `M.D.YY`). |
| `bounce_category` | Não | Corda | Pesquise logs por uma categoria de rejeição específica (por exemplo, `blocklist`). |
| `response_code` | Não | Número | Pesquise logs por um código de resposta de erro específico (por exemplo, `421` ou `550`). |

> Exemplo de solicitação:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Exemplo de tarefa Cron (à meia-noite todos os dias):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Observe que você pode usar serviços como [Crontab.guru](https://crontab.guru/) para validar a sintaxe da expressão do seu cron job.

> Exemplo de tarefa Cron (à meia-noite todos os dias **e com logs do dia anterior**):

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

| Parâmetro Corporal | Obrigatório | Tipo | Descrição |
| -------------- | -------- | -------------- | ------------- |
| `email` | Sim | String (E-mail) | Endereço de email |
| `password` | Sim | Corda | Senha |

> Exemplo de solicitação:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### Recuperar conta {#retrieve-account}

> `GET /v1/account`

> Exemplo de solicitação:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### Atualizar conta {#update-account}

> `PUT /v1/account`

| Parâmetro Corporal | Obrigatório | Tipo | Descrição |
| -------------- | -------- | -------------- | -------------------- |
| `email` | Não | String (E-mail) | Endereço de email |
| `given_name` | Não | Corda | Primeiro nome |
| `family_name` | Não | Corda | Sobrenome |
| `avatar_url` | Não | Sequência de caracteres (URL) | Link para a imagem do avatar |

> Exemplo de solicitação:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

## Contatos de alias (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> Unlike other API endpoints, these require [Authentication](#authentication) "username" equal to the alias username and "password" equal to the alias generated password as Basic Authorization headers.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

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
> Unlike other API endpoints, these require [Authentication](#authentication) "username" equal to the alias username and "password" equal to the alias generated password as Basic Authorization headers.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

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

## Mensagens de alias (IMAP/POP3) {#alias-messages-imappop3}

> \[!NOTE]
> Unlike other API endpoints, these require [Authentication](#authentication) "username" equal to the alias username and "password" equal to the alias generated password as Basic Authorization headers.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

Certifique-se de ter seguido as instruções de configuração do seu domínio.

Essas instruções podem ser encontradas em nossa seção de FAQ [Vocês oferecem suporte para receber e-mails com IMAP?](/faq#do-you-support-receiving-email-with-imap).

### Listar e pesquisar mensagens {#list-and-search-for-messages}

> `GET /v1/messages`

**Em breve**

### Criar mensagem {#create-message}

> \[!NOTE]
> This will **NOT** send an email – it will only simply add the message to your mailbox folder (e.g. this is similar to the IMAP `APPEND` command).  If you would like to send an email, then see [Create outbound SMTP email](#create-outbound-smtp-email) below.  After creating the outbound SMTP email, then you can append a copy of it using this endpoint to your alias' mailbox for storage purposes.

> `POST /v1/messages`

**Em breve**

### Recuperar mensagem {#retrieve-message}

> `GET /v1/messages/:id`

**Em breve**

### Mensagem de atualização {#update-message}

> `PUT /v1/messages/:id`

**Em breve**

### Excluir mensagem {#delete-message}

> `DELETE /v1/messages:id`

**Em breve**

## Pastas de alias (IMAP/POP3) {#alias-folders-imappop3}

> \[!TIP]
> Folder endpoints with a folder's path <code>/v1/folders/:path</code> as their endpoint are interchangeable with a folder's ID <code>:id</code>. This means you can refer to the folder by either its <code>path</code> or <code>id</code> value.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

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

## E-mails de saída {#outbound-emails}

Certifique-se de ter seguido as instruções de configuração do seu domínio.

Estas instruções podem ser encontradas em [Minha conta → Domínios → Configurações → Configuração de SMTP de saída](/my-account/domains). Você precisa garantir a configuração de DKIM, Return-Path e DMARC para enviar SMTP de saída com seu domínio.

### Obter limite de e-mail SMTP de saída {#get-outbound-smtp-email-limit}

Este é um ponto de extremidade simples que retorna um objeto JSON contendo o `count` e o `limit` para o número de mensagens de saída SMTP diárias por conta.

> `GET /v1/emails/limit`

> Exemplo de solicitação:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### Listar e-mails SMTP de saída {#list-outbound-smtp-emails}

Observe que este ponto de extremidade não retorna valores de propriedade para `message`, `headers` nem `rejectedErrors` de um e-mail.

Para retornar essas propriedades e seus valores, use o ponto de extremidade [Recuperar e-mail](#retrieve-email) com um ID de e-mail.

> `GET /v1/emails`

| Parâmetros da string de consulta | Obrigatório | Tipo | Descrição |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | Não | String (suportado por RegExp) | Pesquisar e-mails por metadados |
| `domain` | Não | String (suportado por RegExp) | Pesquisar e-mails por nome de domínio |
| `sort` | Não | Corda | Classificar por um campo específico (prefixe com um único hífen `-` para classificar na direção inversa desse campo). O padrão é `created_at` se não for definido. |
| `page` | Não | Número | Veja [Pagination](#pagination) para mais informações |
| `limit` | Não | Número | Veja [Pagination](#pagination) para mais informações |

> Exemplo de solicitação:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Criar e-mail SMTP de saída {#create-outbound-smtp-email}

Nossa API para criação de e-mails é inspirada e utiliza a configuração de opções de mensagem do Nodemailer. Consulte o [Configuração de mensagem do Nodemailer](https://nodemailer.com/message/) para todos os parâmetros do corpo abaixo.

Observe que, com exceção de `envelope` e `dkim` (já que os configuramos automaticamente para você), oferecemos suporte a todas as opções do Nodemailer. Definimos automaticamente as opções `disableFileAccess` e `disableUrlAccess` como `true` por motivos de segurança.

Você deve passar a opção única de `raw` com seu e-mail completo bruto, incluindo cabeçalhos **ou** passar opções de parâmetros de corpo individuais abaixo.

Este endpoint de API codificará automaticamente emojis para você se eles forem encontrados nos cabeçalhos (por exemplo, uma linha de assunto de `Subject: 🤓 Hello` é convertida para `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello` automaticamente). Nosso objetivo era criar uma API de e-mail extremamente amigável ao desenvolvedor e à prova de erros.

> `POST /v1/emails`

| Parâmetro Corporal | Obrigatório | Tipo | Descrição |
| ---------------- | -------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from` | Não | String (E-mail) | O endereço de e-mail do remetente (deve existir como um alias do domínio). |
| `to` | Não | String ou Array | Lista separada por vírgulas ou uma matriz de destinatários para o cabeçalho "Para". |
| `cc` | Não | String ou Array | Lista separada por vírgulas ou uma matriz de destinatários para o cabeçalho "Cc". |
| `bcc` | Não | String ou Array | Lista separada por vírgulas ou uma matriz de destinatários para o cabeçalho "Cco". |
| `subject` | Não | Corda | Assunto do e-mail. |
| `text` | Não | String ou Buffer | A versão em texto simples da mensagem. |
| `html` | Não | String ou Buffer | A versão HTML da mensagem. |
| `attachments` | Não | Variedade | Uma matriz de objetos de anexo (veja [Nodemailer's common fields](https://nodemailer.com/message/#common-fields)). |
| `sender` | Não | Corda | O endereço de e-mail para o cabeçalho "Remetente" (consulte [Nodemailer's more advanced fields](https://nodemailer.com/message/#more-advanced-fields)). |
| `replyTo` | Não | Corda | O endereço de e-mail para o cabeçalho "Responder para". |
| `inReplyTo` | Não | Corda | O Message-ID ao qual a mensagem é respondida. |
| `references` | Não | String ou Array | Lista separada por espaços ou uma matriz de IDs de mensagens. |
| `attachDataUrls` | Não | Booleano | Se `true` então converte imagens `data:` no conteúdo HTML da mensagem em anexos incorporados. |
| `watchHtml` | Não | Corda | Uma versão HTML específica da mensagem para Apple Watch ([according to the Nodemailer docs](https://nodemailer.com/message/#content-options]), os relógios mais recentes não exigem que isso seja definido). |
| `amp` | Não | Corda | Uma versão HTML específica do AMP4EMAIL da mensagem (veja [Nodemailer's example](https://nodemailer.com/message/#amp-example)). |
| `icalEvent` | Não | Objeto | Um evento iCalendar para usar como conteúdo de mensagem alternativo (veja [Nodemailer's calendar events](https://nodemailer.com/message/calendar-events/)). |
| `alternatives` | Não | Variedade | Uma matriz de conteúdo de mensagem alternativo (veja [Nodemailer's alternative content](https://nodemailer.com/message/alternatives/)). |
| `encoding` | Não | Corda | Codificação para as strings de texto e HTML (o padrão é `"utf-8"`, mas também suporta os valores de codificação `"hex"` e `"base64"`). |
| `raw` | Não | String ou Buffer | Uma mensagem personalizada gerada no formato RFC822 para uso (em vez de uma gerada pelo Nodemailer – veja [Nodemailer's custom source](https://nodemailer.com/message/custom-source/)). |
| `textEncoding` | Não | Corda | Codificação que é forçada a ser usada para valores de texto (`"quoted-printable"` ou `"base64"`). O valor padrão é o valor mais próximo detectado (para ASCII, use `"quoted-printable"`). |
| `priority` | Não | Corda | Nível de prioridade do e-mail (pode ser `"high"`, `"normal"` (padrão) ou `"low"`). Observe que o valor `"normal"` não define um cabeçalho de prioridade (este é o comportamento padrão). Se o valor `"high"` ou `"low"` for definido, os cabeçalhos `X-Priority`, `X-MSMail-Priority` e `Importance` serão [will be set accordingly](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers` | Não | Objeto ou matriz | Um objeto ou uma matriz de campos de cabeçalho adicionais a serem definidos (consulte [Nodemailer's custom headers](https://nodemailer.com/message/custom-headers/)). |
| `messageId` | Não | Corda | Um valor opcional de Message-ID para o cabeçalho "Message-ID" (um valor padrão será criado automaticamente se não for definido – observe que o valor deve [adhere to the RFC2822 specification](https://stackoverflow.com/a/4031705)). |
| `date` | Não | String ou Data | Um valor de data opcional que será usado se o cabeçalho de data estiver ausente após a análise; caso contrário, a string UTC atual será usada se não for definida. O cabeçalho de data não pode ter mais de 30 dias de antecedência da hora atual. |
| `list` | Não | Objeto | Um objeto opcional dos cabeçalhos `List-*` (veja [Nodemailer's list headers](https://nodemailer.com/message/list-headers/)). |

> Exemplo de solicitação:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Exemplo de solicitação:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Recuperar e-mail SMTP de saída {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> Exemplo de solicitação:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Excluir e-mail SMTP de saída {#delete-outbound-smtp-email}

A exclusão de e-mails definirá o status como `"rejected"` (e, consequentemente, não o processará na fila) se, e somente se, o status atual for `"pending"`, `"queued"` ou `"deferred"`. Podemos remover e-mails automaticamente após 30 dias da criação e/ou envio. Portanto, você deve manter uma cópia dos e-mails SMTP enviados em seu cliente, banco de dados ou aplicativo. Você pode referenciar o valor do nosso ID de e-mail em seu banco de dados, se desejar. Esse valor é retornado pelos endpoints [Criar e-mail](#create-email) e [Recuperar e-mail](#retrieve-email).

> `DELETE /v1/emails/:id`

> Exemplo de solicitação:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

## Domínios {#domains}

> \[!TIP]
> Domain endpoints with a domain's name <code>/v1/domains/:domain_name</code> as their endpoint are interchangeable with a domain's ID <code>:domain_id</code>. This means you can refer to the domain by either its <code>name</code> or <code>id</code> value.

### Listar domínios {#list-domains}

> \[!NOTE]
> As of November 1st, 2024 the API endpoints for [List domains](#list-domains) and [List domain aliases](#list-domain-aliases) will default to `1000` max results per page.  If you would like to opt-in to this behavior early, you can pass `?paginate=true` as an additional querystring parameter to the URL for the endpoint query.  See [Pagination](#pagination) for more insight.

> `GET /v1/domains`

| Parâmetros da string de consulta | Obrigatório | Tipo | Descrição |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | Não | String (suportado por RegExp) | Pesquisar domínios por nome |
| `name` | Não | String (suportado por RegExp) | Pesquisar domínios por nome |
| `sort` | Não | Corda | Classificar por um campo específico (prefixe com um único hífen `-` para classificar na direção inversa desse campo). O padrão é `created_at` se não for definido. |
| `page` | Não | Número | Veja [Pagination](#pagination) para mais informações |
| `limit` | Não | Número | Veja [Pagination](#pagination) para mais informações |

> Exemplo de solicitação:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Criar domínio {#create-domain}

> `POST /v1/domains`

| Parâmetro Corporal | Obrigatório | Tipo | Descrição |
| ------------------------------ | -------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain` | Sim | String (FQDN ou IP) | Nome de domínio totalmente qualificado ("FQDN") ou endereço IP |
| `team_domain` | Não | String (ID de domínio ou nome de domínio; FQDN) | Atribua automaticamente este domínio à mesma equipe de outro domínio. Isso significa que todos os membros deste domínio serão atribuídos como membros da equipe, e o `plan` também será automaticamente definido como `team`. Você pode definir como `"none"` se necessário para desabilitar explicitamente essa opção, mas isso não é necessário. |
| `plan` | Não | String (enumerável) | Tipo de plano (deve ser `"free"`, `"enhanced_protection"` ou `"team"`, o padrão é `"free"` ou o plano pago atual do usuário, se houver) |
| `catchall` | Não | String (endereços de e-mail delimitados) ou booleano | Crie um alias catch-all padrão, cujo padrão é `true` (se `true`, usará o endereço de e-mail do usuário da API como destinatário e, se `false`, nenhum alias catch-all será criado). Se uma String for passada, ela será uma lista delimitada de endereços de e-mail a serem usados como destinatários (separados por quebra de linha, espaço e/ou vírgula). |
| `has_adult_content_protection` | Não | Booleano | Se deve habilitar a proteção de conteúdo adulto do Spam Scanner neste domínio |
| `has_phishing_protection` | Não | Booleano | Se deve habilitar a proteção contra phishing do Spam Scanner neste domínio |
| `has_executable_protection` | Não | Booleano | Se deve habilitar a proteção executável do Spam Scanner neste domínio |
| `has_virus_protection` | Não | Booleano | Se deve habilitar a proteção contra vírus do Spam Scanner neste domínio |
| `has_recipient_verification` | Não | Booleano | Padrão de domínio global para exigir que os destinatários de alias cliquem em um link de verificação de e-mail para que os e-mails fluam |
| `ignore_mx_check` | Não | Booleano | Se a verificação do registro MX no domínio deve ser ignorada para verificação. Isso se aplica principalmente a usuários que possuem regras avançadas de configuração de troca MX e precisam manter sua troca MX existente e encaminhar para a nossa. |
| `retention_days` | Não | Número | Número inteiro entre `0` e `30` que corresponde ao número de dias de retenção para armazenar e-mails SMTP de saída, uma vez entregues com sucesso ou com erro permanente. O padrão é `0`, o que significa que os e-mails SMTP de saída são eliminados e eliminados imediatamente para sua segurança. |
| `bounce_webhook` | Não | String (URL) ou Boolean (falso) | A URL do webhook `http://` ou `https://` de sua escolha para enviar webhooks de rejeição. Enviaremos uma solicitação `POST` para esta URL com informações sobre falhas de SMTP de saída (por exemplo, falhas leves ou graves – para que você possa gerenciar seus assinantes e gerenciar programaticamente seus e-mails de saída). |
| `max_quota_per_alias` | Não | Corda | Cota máxima de armazenamento para aliases neste nome de domínio. Insira um valor como "1 GB", que será analisado por [bytes](https://github.com/visionmedia/bytes.js). |

> Exemplo de solicitação:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Recuperar domínio {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> Exemplo de solicitação:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Verificar registros de domínio {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Exemplo de solicitação:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Verificar registros SMTP de domínio {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Exemplo de solicitação:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### Listar senhas abrangentes de todo o domínio {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Exemplo de solicitação:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Crie uma senha abrangente para todo o domínio {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Parâmetro Corporal | Obrigatório | Tipo | Descrição |
| -------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | Não | Corda | Sua nova senha personalizada para usar como senha geral para todo o domínio. Observe que você pode deixar essa informação em branco ou omiti-la completamente no corpo da solicitação da API se desejar obter uma senha forte e gerada aleatoriamente. |
| `description` | Não | Corda | Descrição apenas para fins organizacionais. |

> Exemplo de solicitação:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Remover senha geral de todo o domínio {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Exemplo de solicitação:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Atualizar domínio {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Parâmetro Corporal | Obrigatório | Tipo | Descrição |
| ------------------------------ | -------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port` | Não | String ou Número | Porta personalizada para configurar o encaminhamento SMTP (o padrão é `"25"`) |
| `has_adult_content_protection` | Não | Booleano | Se deve habilitar a proteção de conteúdo adulto do Spam Scanner neste domínio |
| `has_phishing_protection` | Não | Booleano | Se deve habilitar a proteção contra phishing do Spam Scanner neste domínio |
| `has_executable_protection` | Não | Booleano | Se deve habilitar a proteção executável do Spam Scanner neste domínio |
| `has_virus_protection` | Não | Booleano | Se deve habilitar a proteção contra vírus do Spam Scanner neste domínio |
| `has_recipient_verification` | Não | Booleano | Padrão de domínio global para exigir que os destinatários de alias cliquem em um link de verificação de e-mail para que os e-mails fluam |
| `ignore_mx_check` | Não | Booleano | Se a verificação do registro MX no domínio deve ser ignorada para verificação. Isso se aplica principalmente a usuários que possuem regras avançadas de configuração de troca MX e precisam manter sua troca MX existente e encaminhar para a nossa. |
| `retention_days` | Não | Número | Número inteiro entre `0` e `30` que corresponde ao número de dias de retenção para armazenar e-mails SMTP de saída, uma vez entregues com sucesso ou com erro permanente. O padrão é `0`, o que significa que os e-mails SMTP de saída são eliminados e eliminados imediatamente para sua segurança. |
| `bounce_webhook` | Não | String (URL) ou Boolean (falso) | A URL do webhook `http://` ou `https://` de sua escolha para enviar webhooks de rejeição. Enviaremos uma solicitação `POST` para esta URL com informações sobre falhas de SMTP de saída (por exemplo, falhas leves ou graves – para que você possa gerenciar seus assinantes e gerenciar programaticamente seus e-mails de saída). |
| `max_quota_per_alias` | Não | Corda | Cota máxima de armazenamento para aliases neste nome de domínio. Insira um valor como "1 GB", que será analisado por [bytes](https://github.com/visionmedia/bytes.js). |

> Exemplo de solicitação:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Excluir domínio {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> Exemplo de solicitação:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```

## Convites {#invites}

### Aceitar convite de domínio {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> Exemplo de solicitação:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Criar convite de domínio {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Parâmetro Corporal | Obrigatório | Tipo | Descrição |
| -------------- | -------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `email` | Sim | String (E-mail) | Endereço de e-mail para convidar para a lista de membros do domínio |
| `group` | Sim | String (enumerável) | Grupo para adicionar o usuário à associação de domínio com (pode ser um de `"admin"` ou `"user"`) |

> Exemplo de solicitação:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> If the user being invited is already an accepted member of any other domains the admin inviting them is a member of, then it will auto-accept the invite and not send an email.

### Remover convite de domínio {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Parâmetro Corporal | Obrigatório | Tipo | Descrição |
| -------------- | -------- | -------------- | ------------------------------------------------ |
| `email` | Sim | String (E-mail) | Endereço de e-mail para remover da lista de membros do domínio |

> Exemplo de solicitação:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

## Membros {#members}

### Atualizar membro do domínio {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Parâmetro Corporal | Obrigatório | Tipo | Descrição |
| -------------- | -------- | ------------------- | -------------------------------------------------------------------------------------------- |
| `group` | Sim | String (enumerável) | Grupo para atualizar o usuário para a associação de domínio com (pode ser um de `"admin"` ou `"user"`) |

> Exemplo de solicitação:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Remover membro do domínio {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Exemplo de solicitação:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```

## Aliases {#aliases}

### Gerar uma senha de alias {#generate-an-alias-password}

Observe que, se você não enviar instruções por e-mail, o nome de usuário e a senha estarão no corpo da resposta JSON de uma solicitação bem-sucedida no formato `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Parâmetro Corporal | Obrigatório | Tipo | Descrição |
| ---------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | Não | Corda | Sua nova senha personalizada para usar como alias. Observe que você pode deixar essa informação em branco ou até mesmo omiti-la no corpo da solicitação da API se desejar obter uma senha forte e gerada aleatoriamente. |
| `password` | Não | Corda | Senha existente para o alias para alterar a senha sem excluir o armazenamento de caixa de correio IMAP existente (consulte a opção `is_override` abaixo se você não tiver mais a senha existente). |
| `is_override` | Não | Booleano | **USE COM CUIDADO**: Isso substituirá completamente a senha e o banco de dados do alias existentes, excluirá permanentemente o armazenamento IMAP existente e redefinirá completamente o banco de dados de e-mail SQLite do alias. Se possível, faça um backup caso tenha uma caixa de correio vinculada a este alias. |
| `emailed_instructions` | Não | Corda | Endereço de e-mail para onde enviar a senha do alias e as instruções de configuração. |

> Exemplo de solicitação:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### Listar aliases de domínio {#list-domain-aliases}

> \[!NOTE]
> As of November 1st, 2024 the API endpoints for [List domains](#list-domains) and [List domain aliases](#list-domain-aliases) will default to `1000` max results per page.  If you would like to opt-in to this behavior early, you can pass `?paginate=true` as an additional querystring parameter to the URL for the endpoint query.  See [Pagination](#pagination) for more insight.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Parâmetros da string de consulta | Obrigatório | Tipo | Descrição |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q` | Não | String (suportado por RegExp) | Pesquisar aliases em um domínio por nome, rótulo ou destinatário |
| `name` | Não | String (suportado por RegExp) | Pesquisar aliases em um domínio por nome |
| `recipient` | Não | String (suportado por RegExp) | Pesquisar aliases em um domínio por destinatário |
| `sort` | Não | Corda | Classificar por um campo específico (prefixe com um único hífen `-` para classificar na direção inversa desse campo). O padrão é `created_at` se não for definido. |
| `page` | Não | Número | Veja [Pagination](#pagination) para mais informações |
| `limit` | Não | Número | Veja [Pagination](#pagination) para mais informações |

> Exemplo de solicitação:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Criar novo alias de domínio {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Parâmetro Corporal | Obrigatório | Tipo | Descrição |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | Não | Corda | Nome do alias (se não for fornecido ou estiver em branco, um alias aleatório será gerado) |
| `recipients` | Não | String ou Array | Lista de destinatários (deve ser uma string ou matriz separada por quebra de linha/espaço/vírgula de endereços de e-mail válidos, nomes de domínio totalmente qualificados ("FQDN"), endereços IP e/ou URLs de webhook – e se não for fornecida ou for uma matriz vazia, o e-mail do usuário que faz a solicitação de API será definido como o destinatário) |
| `description` | Não | Corda | Descrição do alias |
| `labels` | Não | String ou Array | Lista de rótulos (deve ser uma String ou Array separada por quebra de linha/espaço/vírgula) |
| `has_recipient_verification` | Não | Booleano | Exigir que os destinatários cliquem em um link de verificação de e-mail para que os e-mails sejam enviados (o padrão é a configuração do domínio, se não for definido explicitamente no corpo da solicitação) |
| `is_enabled` | Não | Booleano | Se este alias deve ser habilitado ou desabilitado (se desabilitado, os e-mails não serão roteados para lugar nenhum, mas retornarão códigos de status bem-sucedidos). Se um valor for passado, ele será convertido para um booleano usando [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `error_code_if_disabled` | Não | Número (`250`, `421` ou `550`) | E-mails recebidos neste alias serão rejeitados se `is_enabled` for `false` com `250` (não entrega em lugar nenhum, por exemplo, blackhole ou `/dev/null`), `421` (rejeição suave; e nova tentativa por até ~5 dias) ou `550` falha e rejeição permanentes. O padrão é `250`. |
| `has_imap` | Não | Booleano | Se deve habilitar ou desabilitar o armazenamento IMAP para este alias (se desabilitado, os e-mails recebidos não serão armazenados em [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service). Se um valor for passado, ele será convertido em um booleano usando [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `has_pgp` | Não | Booleano | Se deve habilitar ou desabilitar [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) para [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) usando o alias `public_key`. |
| `public_key` | Não | Corda | Chave pública OpenPGP no formato ASCII Armor ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); por exemplo, chave GPG para `support@forwardemail.net`). Isso só se aplica se você tiver `has_pgp` definido como `true`. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | Não | Corda | Cota máxima de armazenamento para este alias. Deixe em branco para redefinir a cota máxima atual do domínio ou insira um valor como "1 GB", que será analisado por [bytes](https://github.com/visionmedia/bytes.js). Este valor só pode ser ajustado por administradores de domínio. |
| `vacation_responder_is_enabled` | Não | Booleano | Se deve habilitar ou desabilitar uma resposta automática de férias. |
| `vacation_responder_start_date` | Não | Corda | Data de início do respondente de férias (se habilitado e nenhuma data de início definida aqui, ele assume que já foi iniciado). Suportamos formatos de data como `MM/DD/YYYY`, `YYYY-MM-DD` e outros formatos de data por meio de análise inteligente usando `dayjs`. |
| `vacation_responder_end_date` | Não | Corda | Data de término do respondente de férias (se habilitado e sem uma data de término definida aqui, ele assume que nunca termina e responde para sempre). Suportamos formatos de data como `MM/DD/YYYY`, `YYYY-MM-DD` e outros formatos de data por meio de análise inteligente usando `dayjs`. |
| `vacation_responder_subject` | Não | Corda | Assunto em texto simples para a resposta de férias, por exemplo, "Fora do Escritório". Usamos `striptags` para remover todo o HTML aqui. |
| `vacation_responder_message` | Não | Corda | Mensagem em texto simples para o respondente de férias, por exemplo, "Estarei fora do escritório até fevereiro". Usamos `striptags` para remover todo o HTML aqui. |

> Exemplo de solicitação:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Recuperar alias de domínio {#retrieve-domain-alias}

Você pode recuperar um alias de domínio pelo valor `id` ou `name`.

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> Exemplo de solicitação:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> Exemplo de solicitação:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### Atualizar alias de domínio {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Parâmetro Corporal | Obrigatório | Tipo | Descrição |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | Não | Corda | Nome alternativo |
| `recipients` | Não | String ou Array | Lista de destinatários (deve ser uma string ou matriz separada por quebra de linha/espaço/vírgula de endereços de e-mail válidos, nomes de domínio totalmente qualificados ("FQDN"), endereços IP e/ou URLs de webhook) |
| `description` | Não | Corda | Descrição do alias |
| `labels` | Não | String ou Array | Lista de rótulos (deve ser uma String ou Array separada por quebra de linha/espaço/vírgula) |
| `has_recipient_verification` | Não | Booleano | Exigir que os destinatários cliquem em um link de verificação de e-mail para que os e-mails sejam enviados (o padrão é a configuração do domínio, se não for definido explicitamente no corpo da solicitação) |
| `is_enabled` | Não | Booleano | Se este alias deve ser habilitado ou desabilitado (se desabilitado, os e-mails não serão roteados para lugar nenhum, mas retornarão códigos de status bem-sucedidos). Se um valor for passado, ele será convertido para um booleano usando [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `error_code_if_disabled` | Não | Número (`250`, `421` ou `550`) | E-mails recebidos neste alias serão rejeitados se `is_enabled` for `false` com `250` (não entrega em lugar nenhum, por exemplo, blackhole ou `/dev/null`), `421` (rejeição suave; e nova tentativa por até ~5 dias) ou `550` falha e rejeição permanentes. O padrão é `250`. |
| `has_imap` | Não | Booleano | Se deve habilitar ou desabilitar o armazenamento IMAP para este alias (se desabilitado, os e-mails recebidos não serão armazenados em [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service). Se um valor for passado, ele será convertido em um booleano usando [boolean](https://github.com/thenativeweb/boolean#quick-start)) |
| `has_pgp` | Não | Booleano | Se deve habilitar ou desabilitar [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) para [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) usando o alias `public_key`. |
| `public_key` | Não | Corda | Chave pública OpenPGP no formato ASCII Armor ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); por exemplo, chave GPG para `support@forwardemail.net`). Isso só se aplica se você tiver `has_pgp` definido como `true`. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota` | Não | Corda | Cota máxima de armazenamento para este alias. Deixe em branco para redefinir a cota máxima atual do domínio ou insira um valor como "1 GB", que será analisado por [bytes](https://github.com/visionmedia/bytes.js). Este valor só pode ser ajustado por administradores de domínio. |
| `vacation_responder_is_enabled` | Não | Booleano | Se deve habilitar ou desabilitar uma resposta automática de férias. |
| `vacation_responder_start_date` | Não | Corda | Data de início do respondente de férias (se habilitado e nenhuma data de início definida aqui, ele assume que já foi iniciado). Suportamos formatos de data como `MM/DD/YYYY`, `YYYY-MM-DD` e outros formatos de data por meio de análise inteligente usando `dayjs`. |
| `vacation_responder_end_date` | Não | Corda | Data de término do respondente de férias (se habilitado e sem uma data de término definida aqui, ele assume que nunca termina e responde para sempre). Suportamos formatos de data como `MM/DD/YYYY`, `YYYY-MM-DD` e outros formatos de data por meio de análise inteligente usando `dayjs`. |
| `vacation_responder_subject` | Não | Corda | Assunto em texto simples para a resposta de férias, por exemplo, "Fora do Escritório". Usamos `striptags` para remover todo o HTML aqui. |
| `vacation_responder_message` | Não | Corda | Mensagem em texto simples para o respondente de férias, por exemplo, "Estarei fora do escritório até fevereiro". Usamos `striptags` para remover todo o HTML aqui. |

> Exemplo de solicitação:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Excluir alias de domínio {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Exemplo de solicitação:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

## Criptografar {#encrypt}

Permitimos que você criptografe registros, mesmo no plano gratuito, sem nenhum custo. A privacidade não deve ser um recurso, mas sim inerente a todos os aspectos de um produto. Conforme altamente solicitado em [Discussão sobre Guias de Privacidade](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) e em [nossos problemas no GitHub](https://github.com/forwardemail/forwardemail.net/issues/254), adicionamos isso.

### Criptografar registro TXT {#encrypt-txt-record}

> `POST /v1/encrypt`

| Parâmetro Corporal | Obrigatório | Tipo | Descrição |
| -------------- | -------- | ------ | -------------------------------------------- |
| `input` | Sim | Corda | Qualquer registro TXT de texto simples de encaminhamento de e-mail válido |

> Exemplo de solicitação:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
