# Servidor Forward Email MCP {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Servidor Forward Email MCP" class="rounded-lg" />

<p class="lead mt-3">
  <strong>Resumo:</strong> Nosso <a href="https://github.com/forwardemail/mcp-server">servidor MCP open-source</a> permite que assistentes de IA como Claude, ChatGPT, Cursor e Windsurf gerenciem seu email, domínios, aliases, contatos e calendários por meio de linguagem natural. Todos os 68 endpoints da API são expostos como ferramentas MCP. Ele roda localmente via <code>npx @forwardemail/mcp-server</code> — suas credenciais nunca saem da sua máquina.
</p>


## Índice {#table-of-contents}

* [O que é MCP?](#what-is-mcp)
* [Início Rápido](#quick-start)
  * [Obter uma Chave de API](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Outros Clientes MCP](#other-mcp-clients)
* [Autenticação](#authentication)
  * [Autenticação por Chave de API](#api-key-auth)
  * [Autenticação por Alias](#alias-auth)
  * [Gerando uma Senha de Alias](#generating-an-alias-password)
* [Todas as 68 Ferramentas](#all-68-tools)
  * [Conta (Chave de API ou Autenticação por Alias)](#account-api-key-or-alias-auth)
  * [Domínios (Chave de API)](#domains-api-key)
  * [Aliases (Chave de API)](#aliases-api-key)
  * [Emails — SMTP de Saída (Chave de API; Send suporta ambos)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Mensagens — IMAP (Autenticação por Alias)](#messages--imap-alias-auth)
  * [Pastas — IMAP (Autenticação por Alias)](#folders--imap-alias-auth)
  * [Contatos — CardDAV (Autenticação por Alias)](#contacts--carddav-alias-auth)
  * [Calendários — CalDAV (Autenticação por Alias)](#calendars--caldav-alias-auth)
  * [Eventos de Calendário — CalDAV (Autenticação por Alias)](#calendar-events--caldav-alias-auth)
  * [Scripts Sieve (Chave de API)](#sieve-scripts-api-key)
  * [Scripts Sieve (Autenticação por Alias)](#sieve-scripts-alias-auth)
  * [Membros e Convites de Domínio (Chave de API)](#domain-members-and-invites-api-key)
  * [Senhas Catch-All (Chave de API)](#catch-all-passwords-api-key)
  * [Logs (Chave de API)](#logs-api-key)
  * [Criptografar (Sem Autenticação)](#encrypt-no-auth)
* [20 Casos de Uso Reais](#20-real-world-use-cases)
  * [1. Triagem de Email](#1-email-triage)
  * [2. Automação de Configuração de Domínio](#2-domain-setup-automation)
  * [3. Gerenciamento em Massa de Aliases](#3-bulk-alias-management)
  * [4. Monitoramento de Campanhas de Email](#4-email-campaign-monitoring)
  * [5. Sincronização e Limpeza de Contatos](#5-contact-sync-and-cleanup)
  * [6. Gerenciamento de Calendário](#6-calendar-management)
  * [7. Automação de Scripts Sieve](#7-sieve-script-automation)
  * [8. Integração de Equipe](#8-team-onboarding)
  * [9. Auditoria de Segurança](#9-security-auditing)
  * [10. Configuração de Encaminhamento de Email](#10-email-forwarding-setup)
  * [11. Busca e Análise na Caixa de Entrada](#11-inbox-search-and-analysis)
  * [12. Organização de Pastas](#12-folder-organization)
  * [13. Rotação de Senhas](#13-password-rotation)
  * [14. Criptografia de Registros DNS](#14-dns-record-encryption)
  * [15. Análise de Logs de Entrega](#15-delivery-log-analysis)
  * [16. Gerenciamento Multi-Domínio](#16-multi-domain-management)
  * [17. Configuração Catch-All](#17-catch-all-configuration)
  * [18. Gerenciamento de Convites de Domínio](#18-domain-invite-management)
  * [19. Teste de Armazenamento S3](#19-s3-storage-testing)
  * [20. Composição de Rascunho de Email](#20-email-draft-composition)
* [Exemplos de Prompts](#example-prompts)
* [Variáveis de Ambiente](#environment-variables)
* [Segurança](#security)
* [Uso Programático](#programmatic-usage)
* [Código Aberto](#open-source)


## O que é MCP? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) é um padrão aberto criado pela Anthropic que permite que modelos de IA chamem ferramentas externas de forma segura. Em vez de copiar e colar respostas da API em uma janela de chat, o MCP dá ao modelo acesso direto e estruturado aos seus serviços.

Nosso servidor MCP encapsula toda a [API Forward Email](/email-api) — cada endpoint, cada parâmetro — e os expõe como ferramentas que qualquer cliente compatível com MCP pode usar. O servidor roda localmente na sua máquina usando transporte stdio. Suas credenciais permanecem nas suas variáveis de ambiente e nunca são enviadas ao modelo de IA.


## Início Rápido {#quick-start}

### Obter uma Chave de API {#get-an-api-key}
1. Faça login na sua [conta Forward Email](/my-account/domains).
2. Vá para **Minha Conta** → **Segurança** → **Chaves API**.
3. Gere uma nova chave API e copie-a.

### Claude Desktop {#claude-desktop}

Adicione isto ao seu arquivo de configuração do Claude Desktop:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "forwardemail": {
      "command": "npx",
      "args": ["-y", "@forwardemail/mcp-server"],
      "env": {
        "FORWARD_EMAIL_API_KEY": "your-api-key-here",
        "FORWARD_EMAIL_ALIAS_USER": "you@example.com",
        "FORWARD_EMAIL_ALIAS_PASSWORD": "your-generated-alias-password"
      }
    }
  }
}
```

Reinicie o Claude Desktop. Você deverá ver as ferramentas do Forward Email no seletor de ferramentas.

> **Nota:** As variáveis `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD` são opcionais, mas necessárias para as ferramentas de caixa de correio (mensagens, pastas, contatos, calendários). Veja [Autenticação](#authentication) para detalhes.

### Cursor {#cursor}

Abra Configurações do Cursor → MCP → Adicionar Servidor:

```json
{
  "mcpServers": {
    "forwardemail": {
      "command": "npx",
      "args": ["-y", "@forwardemail/mcp-server"],
      "env": {
        "FORWARD_EMAIL_API_KEY": "your-api-key-here",
        "FORWARD_EMAIL_ALIAS_USER": "you@example.com",
        "FORWARD_EMAIL_ALIAS_PASSWORD": "your-generated-alias-password"
      }
    }
  }
}
```

### Windsurf {#windsurf}

Abra Configurações do Windsurf → MCP → Adicionar Servidor com a mesma configuração acima.

### Outros Clientes MCP {#other-mcp-clients}

Qualquer cliente que suporte o transporte MCP stdio funcionará. O comando é:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## Autenticação {#authentication}

A API do Forward Email usa **autenticação HTTP Basic** com dois tipos diferentes de credenciais dependendo do endpoint. O servidor MCP lida com isso automaticamente — você só precisa fornecer as credenciais corretas.

### Autenticação por Chave API {#api-key-auth}

A maioria dos endpoints de gerenciamento (domínios, aliases, emails enviados, logs) usa sua **chave API** como nome de usuário da autenticação Basic com senha vazia.

Esta é a mesma chave API que você usa para a API REST. Defina-a via a variável de ambiente `FORWARD_EMAIL_API_KEY`.

### Autenticação por Alias {#alias-auth}

Endpoints de caixa de correio (mensagens, pastas, contatos, calendários, scripts sieve por alias) usam **credenciais de alias** — o endereço de email do alias como nome de usuário e uma senha gerada como senha.

Esses endpoints acessam dados por alias via protocolos IMAP, CalDAV e CardDAV. Eles requerem o email do alias e uma senha gerada, não a chave API.

Você pode fornecer credenciais de alias de duas formas:

1. **Variáveis de ambiente** (recomendado para alias padrão): Defina `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **Parâmetros por chamada de ferramenta**: Passe `alias_username` e `alias_password` como argumentos para qualquer ferramenta que use autenticação por alias. Estes substituem as variáveis de ambiente, o que é útil ao trabalhar com múltiplos aliases.

### Gerando uma Senha de Alias {#generating-an-alias-password}

Antes de usar ferramentas com autenticação por alias, você precisa gerar uma senha para o alias. Você pode fazer isso com a ferramenta `generateAliasPassword` ou via API:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

A resposta inclui os campos `username` (email do alias) e `password`. Use-os como suas credenciais de alias.

> **Dica:** Você também pode pedir ao seu assistente de IA: *"Gere uma senha para o alias <user@example.com> no domínio example.com"* — ele chamará a ferramenta `generateAliasPassword` e retornará as credenciais.

A tabela abaixo resume qual método de autenticação cada grupo de ferramentas requer:

| Grupo de Ferramentas                                           | Método de Autenticação    | Credenciais                                                |
| -------------------------------------------------------------- | ------------------------- | ---------------------------------------------------------- |
| Conta                                                         | Chave API **ou** Alias    | Qualquer um                                               |
| Domínios, Aliases, Membros do Domínio, Convites, Senhas Catch-All | Chave API                 | `FORWARD_EMAIL_API_KEY`                                    |
| Emails Enviados (listar, obter, deletar, limitar)             | Chave API                 | `FORWARD_EMAIL_API_KEY`                                    |
| Enviar Email                                                  | Chave API **ou** Alias    | Qualquer um                                               |
| Mensagens (IMAP)                                              | Alias                     | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Pastas (IMAP)                                                | Alias                     | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Contatos (CardDAV)                                           | Alias                     | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Calendários (CalDAV)                                         | Alias                     | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Eventos de Calendário (CalDAV)                              | Alias                     | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Scripts Sieve (escopo de domínio)                           | Chave API                 | `FORWARD_EMAIL_API_KEY`                                    |
| Scripts Sieve (escopo de alias)                             | Alias                     | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Logs                                                         | Chave API                 | `FORWARD_EMAIL_API_KEY`                                    |
| Criptografar                                                | Nenhum                    | Nenhuma credencial necessária                              |
## Todas as 68 Ferramentas {#all-68-tools}

Cada ferramenta corresponde diretamente a um endpoint da [Forward Email API](/email-api). Os parâmetros usam os mesmos nomes da documentação da API. O método de autenticação é indicado no título de cada seção.

### Conta (Chave API ou Autenticação por Alias) {#account-api-key-or-alias-auth}

Com autenticação por chave API, estas retornam as informações da sua conta de usuário. Com autenticação por alias, retornam informações do alias/caixa de correio incluindo cota de armazenamento e configurações.

| Ferramenta       | Endpoint da API    | Descrição                    |
| --------------- | ----------------- | ---------------------------- |
| `getAccount`    | `GET /v1/account` | Obter informações da sua conta |
| `updateAccount` | `PUT /v1/account` | Atualizar as configurações da sua conta |

### Domínios (Chave API) {#domains-api-key}

| Ferramenta             | Endpoint da API                                   | Descrição                 |
| --------------------- | ------------------------------------------------ | ------------------------- |
| `listDomains`         | `GET /v1/domains`                                | Listar todos os seus domínios |
| `createDomain`        | `POST /v1/domains`                               | Adicionar um novo domínio  |
| `getDomain`           | `GET /v1/domains/:domain_id`                     | Obter detalhes do domínio  |
| `updateDomain`        | `PUT /v1/domains/:domain_id`                     | Atualizar configurações do domínio |
| `deleteDomain`        | `DELETE /v1/domains/:domain_id`                  | Remover um domínio         |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records`      | Verificar registros DNS    |
| `verifySmtpRecords`   | `GET /v1/domains/:domain_id/verify-smtp`         | Verificar configuração SMTP |
| `testS3Connection`    | `POST /v1/domains/:domain_id/test-s3-connection` | Testar armazenamento S3 personalizado |

### Aliases (Chave API) {#aliases-api-key}

| Ferramenta               | Endpoint da API                                                    | Descrição                                |
| ----------------------- | ----------------------------------------------------------------- | ---------------------------------------- |
| `listAliases`           | `GET /v1/domains/:domain_id/aliases`                              | Listar aliases de um domínio             |
| `createAlias`           | `POST /v1/domains/:domain_id/aliases`                             | Criar um novo alias                      |
| `getAlias`              | `GET /v1/domains/:domain_id/aliases/:alias_id`                    | Obter detalhes do alias                  |
| `updateAlias`           | `PUT /v1/domains/:domain_id/aliases/:alias_id`                    | Atualizar um alias                       |
| `deleteAlias`           | `DELETE /v1/domains/:domain_id/aliases/:alias_id`                 | Excluir um alias                         |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | Gerar senha IMAP/SMTP para autenticação por alias |

### Emails — SMTP de Saída (Chave API; Send suporta ambos) {#emails--outbound-smtp-api-key-send-supports-both}

| Ferramenta       | Endpoint da API        | Autenticação          | Descrição                    |
| --------------- | --------------------- | --------------------- | ---------------------------- |
| `sendEmail`     | `POST /v1/emails`     | Chave API ou Alias    | Enviar um email via SMTP     |
| `listEmails`    | `GET /v1/emails`      | Chave API             | Listar emails enviados       |
| `getEmail`      | `GET /v1/emails/:id`  | Chave API             | Obter detalhes e status do email |
| `deleteEmail`   | `DELETE /v1/emails/:id` | Chave API           | Excluir um email na fila     |
| `getEmailLimit` | `GET /v1/emails/limit` | Chave API             | Verificar seu limite de envio |

A ferramenta `sendEmail` aceita `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` e `attachments`. Isso é o mesmo que o endpoint `POST /v1/emails`.

### Mensagens — IMAP (Autenticação por Alias) {#messages--imap-alias-auth}

> **Requer credenciais de alias.** Passe `alias_username` e `alias_password` ou defina as variáveis de ambiente `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD`.
| Ferramenta       | Endpoint da API           | Descrição                           |
| --------------- | ------------------------- | ------------------------------------- |
| `listMessages`  | `GET /v1/messages`        | Listar e buscar mensagens em uma caixa de correio |
| `createMessage` | `POST /v1/messages`       | Criar um rascunho ou enviar uma mensagem    |
| `getMessage`    | `GET /v1/messages/:id`    | Obter uma mensagem pelo ID                   |
| `updateMessage` | `PUT /v1/messages/:id`    | Atualizar flags (lida, marcada, etc.)    |
| `deleteMessage` | `DELETE /v1/messages/:id` | Excluir uma mensagem                      |

A ferramenta `listMessages` suporta mais de 15 parâmetros de busca incluindo `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` e `has_attachment`. Veja a [documentação da API](/email-api) para a lista completa.

### Pastas — IMAP (Autenticação por Alias) {#folders--imap-alias-auth}

> **Requer credenciais de alias.** Passe `alias_username` e `alias_password` ou defina as variáveis de ambiente `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Ferramenta      | Endpoint da API          | Descrição              |
| -------------- | ------------------------ | ------------------------ |
| `listFolders`  | `GET /v1/folders`        | Listar todas as pastas da caixa de correio |
| `createFolder` | `POST /v1/folders`       | Criar uma nova pasta      |
| `getFolder`    | `GET /v1/folders/:id`    | Obter detalhes da pasta       |
| `updateFolder` | `PUT /v1/folders/:id`    | Renomear uma pasta          |
| `deleteFolder` | `DELETE /v1/folders/:id` | Excluir uma pasta          |

### Contatos — CardDAV (Autenticação por Alias) {#contacts--carddav-alias-auth}

> **Requer credenciais de alias.** Passe `alias_username` e `alias_password` ou defina as variáveis de ambiente `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Ferramenta       | Endpoint da API           | Descrição          |
| --------------- | ------------------------- | -------------------- |
| `listContacts`  | `GET /v1/contacts`        | Listar todos os contatos    |
| `createContact` | `POST /v1/contacts`       | Criar um novo contato |
| `getContact`    | `GET /v1/contacts/:id`    | Obter detalhes do contato  |
| `updateContact` | `PUT /v1/contacts/:id`    | Atualizar um contato     |
| `deleteContact` | `DELETE /v1/contacts/:id` | Excluir um contato     |

### Calendários — CalDAV (Autenticação por Alias) {#calendars--caldav-alias-auth}

> **Requer credenciais de alias.** Passe `alias_username` e `alias_password` ou defina as variáveis de ambiente `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Ferramenta        | Endpoint da API            | Descrição           |
| ---------------- | -------------------------- | --------------------- |
| `listCalendars`  | `GET /v1/calendars`        | Listar todos os calendários    |
| `createCalendar` | `POST /v1/calendars`       | Criar um novo calendário |
| `getCalendar`    | `GET /v1/calendars/:id`    | Obter detalhes do calendário  |
| `updateCalendar` | `PUT /v1/calendars/:id`    | Atualizar um calendário     |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | Excluir um calendário     |

### Eventos do Calendário — CalDAV (Autenticação por Alias) {#calendar-events--caldav-alias-auth}

> **Requer credenciais de alias.** Passe `alias_username` e `alias_password` ou defina as variáveis de ambiente `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Ferramenta             | Endpoint da API                  | Descrição        |
| --------------------- | -------------------------------- | ------------------ |
| `listCalendarEvents`  | `GET /v1/calendar-events`        | Listar todos os eventos    |
| `createCalendarEvent` | `POST /v1/calendar-events`       | Criar um novo evento |
| `getCalendarEvent`    | `GET /v1/calendar-events/:id`    | Obter detalhes do evento  |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id`    | Atualizar um evento    |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | Excluir um evento    |

### Scripts Sieve (Chave da API) {#sieve-scripts-api-key}

Estes usam caminhos com escopo de domínio e autenticam com sua chave da API.

| Ferramenta             | Endpoint da API                                                              | Descrição               |
| --------------------- | ------------------------------------------------------------------------- | ------------------------- |
| `listSieveScripts`    | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve`                      | Listar scripts para um alias |
| `createSieveScript`   | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve`                     | Criar um novo script       |
| `getSieveScript`      | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`           | Obter detalhes do script        |
| `updateSieveScript`   | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`           | Atualizar um script           |
| `deleteSieveScript`   | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`        | Excluir um script           |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | Ativar um script         |
### Scripts Sieve (Autenticação por Alias) {#sieve-scripts-alias-auth}

Estes usam autenticação no nível do alias. Útil para automação por alias sem precisar da chave da API.

> **Requer credenciais do alias.** Passe `alias_username` e `alias_password` ou defina as variáveis de ambiente `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Ferramenta                     | Endpoint da API                              | Descrição          |
| ------------------------------ | -------------------------------------------- | ------------------ |
| `listSieveScriptsAliasAuth`    | `GET /v1/sieve-scripts`                      | Listar scripts     |
| `createSieveScriptAliasAuth`   | `POST /v1/sieve-scripts`                     | Criar um script    |
| `getSieveScriptAliasAuth`      | `GET /v1/sieve-scripts/:script_id`           | Obter detalhes do script |
| `updateSieveScriptAliasAuth`   | `PUT /v1/sieve-scripts/:script_id`           | Atualizar um script |
| `deleteSieveScriptAliasAuth`   | `DELETE /v1/sieve-scripts/:script_id`        | Excluir um script  |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | Ativar um script   |

### Membros e Convites de Domínio (Chave da API) {#domain-members-and-invites-api-key}

| Ferramenta             | Endpoint da API                                     | Descrição                  |
| ---------------------- | -------------------------------------------------- | -------------------------- |
| `updateDomainMember`   | `PUT /v1/domains/:domain_id/members/:member_id`    | Alterar o papel de um membro |
| `removeDomainMember`   | `DELETE /v1/domains/:domain_id/members/:member_id` | Remover um membro          |
| `acceptDomainInvite`   | `GET /v1/domains/:domain_id/invites`               | Aceitar um convite pendente |
| `createDomainInvite`   | `POST /v1/domains/:domain_id/invites`              | Convidar alguém para um domínio |
| `removeDomainInvite`   | `DELETE /v1/domains/:domain_id/invites`            | Revogar um convite         |

### Senhas Catch-All (Chave da API) {#catch-all-passwords-api-key}

| Ferramenta               | Endpoint da API                                                  | Descrição                   |
| ------------------------ | --------------------------------------------------------------- | --------------------------- |
| `listCatchAllPasswords`  | `GET /v1/domains/:domain_id/catch-all-passwords`                | Listar senhas catch-all     |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords`               | Criar uma senha catch-all   |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id`   | Excluir uma senha catch-all |

### Logs (Chave da API) {#logs-api-key}

| Ferramenta       | Endpoint da API            | Descrição                      |
| ---------------- | -------------------------- | ------------------------------ |
| `downloadLogs`   | `GET /v1/logs/download`    | Baixar logs de entrega de email |

### Criptografar (Sem Autenticação) {#encrypt-no-auth}

| Ferramenta       | Endpoint da API       | Descrição                  |
| ---------------- | -------------------- | -------------------------- |
| `encryptRecord`  | `POST /v1/encrypt`    | Criptografar um registro DNS TXT |

Esta ferramenta não requer autenticação. Ela criptografa registros de encaminhamento como `forward-email=user@example.com` para uso em registros DNS TXT.


## 20 Casos de Uso Reais {#20-real-world-use-cases}

Aqui estão formas práticas de usar o servidor MCP com seu assistente de IA:

### 1. Triagem de Email {#1-email-triage}

Peça para sua IA escanear sua caixa de entrada e resumir mensagens não lidas. Ela pode sinalizar emails urgentes, categorizar por remetente e redigir respostas — tudo por linguagem natural. *(Requer credenciais do alias para acesso à caixa de entrada.)*

### 2. Automação de Configuração de Domínio {#2-domain-setup-automation}

Configurando um novo domínio? Peça para a IA criar o domínio, adicionar seus aliases, verificar registros DNS e testar a configuração SMTP. O que normalmente leva 10 minutos clicando em painéis vira uma única conversa.

### 3. Gerenciamento em Massa de Aliases {#3-bulk-alias-management}

Precisa criar 20 aliases para um novo projeto? Descreva o que precisa e deixe a IA cuidar do trabalho repetitivo. Ela pode criar aliases, definir regras de encaminhamento e gerar senhas de uma vez só.
### 4. Monitoramento de Campanhas de Email {#4-email-campaign-monitoring}

Peça ao seu AI para verificar limites de envio, listar emails enviados recentemente e reportar o status de entrega. Útil para monitorar a saúde de emails transacionais.

### 5. Sincronização e Limpeza de Contatos {#5-contact-sync-and-cleanup}

Use as ferramentas CardDAV para listar todos os contatos, encontrar duplicatas, atualizar informações desatualizadas ou criar contatos em massa a partir de uma planilha que você cole no chat. *(Requer credenciais de alias.)*

### 6. Gerenciamento de Calendário {#6-calendar-management}

Crie calendários, adicione eventos, atualize horários de reuniões e exclua eventos cancelados — tudo por meio de conversa. As ferramentas CalDAV suportam CRUD completo tanto em calendários quanto em eventos. *(Requer credenciais de alias.)*

### 7. Automação de Scripts Sieve {#7-sieve-script-automation}

Scripts Sieve são poderosos, mas a sintaxe é arcaica. Peça ao seu AI para escrever scripts Sieve para você: "Filtrar todos os emails de <billing@example.com> para uma pasta de Cobrança" vira um script funcional sem precisar mexer na especificação RFC 5228.

### 8. Integração de Equipe {#8-team-onboarding}

Quando um novo membro entra na equipe, peça ao AI para criar o alias dele, gerar uma senha, enviar um email de boas-vindas com as credenciais e adicioná-lo como membro do domínio. Um comando, quatro chamadas de API.

### 9. Auditoria de Segurança {#9-security-auditing}

Peça ao seu AI para listar todos os domínios, verificar o status de verificação DNS, revisar configurações de alias e identificar domínios com registros não verificados. Uma varredura rápida de segurança em linguagem natural.

### 10. Configuração de Encaminhamento de Email {#10-email-forwarding-setup}

Configurando encaminhamento de email para um novo domínio? Peça ao AI para criar o domínio, adicionar aliases de encaminhamento, criptografar os registros DNS e verificar se tudo está configurado corretamente.

### 11. Busca e Análise na Caixa de Entrada {#11-inbox-search-and-analysis}

Use as ferramentas de busca de mensagens para encontrar emails específicos: "Encontre todos os emails de <john@example.com> nos últimos 30 dias que tenham anexos." Os mais de 15 parâmetros de busca tornam isso poderoso. *(Requer credenciais de alias.)*

### 12. Organização de Pastas {#12-folder-organization}

Peça ao seu AI para criar uma estrutura de pastas para um novo projeto, mover mensagens entre pastas ou limpar pastas antigas que você não precisa mais. *(Requer credenciais de alias.)*

### 13. Rotação de Senhas {#13-password-rotation}

Gere novas senhas para aliases em uma programação. Peça ao seu AI para gerar uma nova senha para cada alias e reportar as novas credenciais.

### 14. Criptografia de Registro DNS {#14-dns-record-encryption}

Criptografe seus registros de encaminhamento antes de adicioná-los ao DNS. A ferramenta `encryptRecord` faz isso sem autenticação — útil para criptografias rápidas e pontuais.

### 15. Análise de Logs de Entrega {#15-delivery-log-analysis}

Baixe seus logs de entrega de email e peça ao AI para analisar taxas de rejeição, identificar destinatários problemáticos ou rastrear tempos de entrega.

### 16. Gerenciamento Multi-Domínio {#16-multi-domain-management}

Se você gerencia múltiplos domínios, peça ao AI para fornecer um relatório de status: quais domínios estão verificados, quais têm problemas, quantos aliases cada um tem e como estão os limites de envio.

### 17. Configuração Catch-All {#17-catch-all-configuration}

Configure senhas catch-all para domínios que precisam receber email em qualquer endereço. O AI pode criar, listar e gerenciar essas senhas para você.

### 18. Gerenciamento de Convites de Domínio {#18-domain-invite-management}

Convide membros da equipe para gerenciar domínios, verifique convites pendentes e limpe os expirados. Útil para organizações com múltiplos administradores de domínio.

### 19. Teste de Armazenamento S3 {#19-s3-storage-testing}

Se você usa armazenamento S3 personalizado para backups de email, peça ao AI para testar a conexão e verificar se está funcionando corretamente.

### 20. Composição de Rascunho de Email {#20-email-draft-composition}

Crie rascunhos de emails na sua caixa de correio sem enviá-los. Útil para preparar emails que precisam de revisão antes do envio ou para construir modelos de email. *(Requer credenciais de alias.)*


## Exemplos de Comandos {#example-prompts}

Aqui estão comandos que você pode usar diretamente com seu assistente AI:

**Enviando email:**

> "Envie um email de <hello@mydomain.com> para <john@example.com> com o assunto 'Reunião Amanhã' e corpo 'Oi John, ainda está confirmado para as 14h?'"
**Gerenciamento de domínio:**

> "Liste todos os meus domínios e diga quais têm registros DNS não verificados."

**Criação de alias:**

> "Crie um novo alias <support@mydomain.com> que encaminhe para meu e-mail pessoal."

**Busca na caixa de entrada (requer credenciais do alias):**

> "Encontre todos os e-mails não lidos da última semana que mencionem 'invoice'."

**Calendário (requer credenciais do alias):**

> "Crie um calendário chamado 'Trabalho' e adicione uma reunião para amanhã às 14h chamada 'Reunião da Equipe'."

**Scripts Sieve:**

> "Escreva um script Sieve para <info@mydomain.com> que responda automaticamente aos e-mails com 'Obrigado por entrar em contato, responderemos em até 24 horas.'"

**Operações em massa:**

> "Crie aliases para sales@, support@, billing@ e info@ em mydomain.com, todos encaminhando para <team@mydomain.com>."

**Verificação de segurança:**

> "Verifique o status de verificação DNS e SMTP de todos os meus domínios e me informe se algo precisa de atenção."

**Gerar senha para alias:**

> "Gere uma senha para o alias <user@example.com> para que eu possa acessar minha caixa de entrada."


## Variáveis de Ambiente {#environment-variables}

| Variável                       | Obrigatória | Padrão                         | Descrição                                                                     |
| ------------------------------ | ----------- | ------------------------------ | ----------------------------------------------------------------------------- |
| `FORWARD_EMAIL_API_KEY`        | Sim         | —                              | Sua chave de API do Forward Email (usada como nome de usuário Basic auth para endpoints com chave API) |
| `FORWARD_EMAIL_ALIAS_USER`     | Não         | —                              | Endereço de e-mail do alias para endpoints de caixa de entrada (ex.: `user@example.com`)            |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | Não         | —                              | Senha gerada para o alias nos endpoints de caixa de entrada                   |
| `FORWARD_EMAIL_API_URL`        | Não         | `https://api.forwardemail.net` | URL base da API (para auto-hospedagem ou testes)                             |


## Segurança {#security}

O servidor MCP roda localmente na sua máquina. Veja como a segurança funciona:

* **Suas credenciais permanecem locais.** Tanto sua chave de API quanto as credenciais do alias são lidas de variáveis de ambiente e usadas para autenticar requisições API via HTTP Basic auth. Elas nunca são enviadas ao modelo de IA.
* **Transporte stdio.** O servidor se comunica com o cliente de IA via stdin/stdout. Nenhuma porta de rede é aberta.
* **Sem armazenamento de dados.** O servidor é stateless. Não faz cache, log ou armazena nenhum dado do seu e-mail.
* **Código aberto.** Todo o código está no [GitHub](https://github.com/forwardemail/mcp-server). Você pode auditar cada linha.


## Uso Programático {#programmatic-usage}

Você também pode usar o servidor como uma biblioteca:

```js
const { McpServer } = require('@forwardemail/mcp-server');

const server = new McpServer({
  apiKey: 'your-api-key',
  aliasUser: 'user@example.com',
  aliasPassword: 'generated-alias-password',
});

server.listen();
```


## Código Aberto {#open-source}

O Forward Email MCP Server é [código aberto no GitHub](https://github.com/forwardemail/mcp-server) sob a licença BUSL-1.1. Acreditamos em transparência. Se encontrar um bug ou quiser um recurso, [abra uma issue](https://github.com/forwardemail/mcp-server/issues).
