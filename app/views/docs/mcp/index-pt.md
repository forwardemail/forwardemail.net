# Servidor MCP do Forward Email {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> Nosso <a href="https://github.com/forwardemail/mcp-server">servidor MCP de código aberto</a> permite que assistentes de IA como Claude, ChatGPT, Cursor e Windsurf gerenciem seu e-mail, domínios, apelidos, contatos e calendários por meio de linguagem natural. Todos os 68 endpoints da API são expostos como ferramentas MCP. Ele é executado localmente via <code>npx @forwardemail/mcp-server</code> — suas credenciais nunca saem da sua máquina.
</p>

## Índice {#table-of-contents}

* [O que é MCP?](#what-is-mcp)
* [Início rápido](#quick-start)
  * [Obter uma chave de API](#get-an-api-key)
  * [Claude Desktop](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [Outros clientes MCP](#other-mcp-clients)
* [Autenticação](#authentication)
  * [Autenticação por chave de API](#api-key-auth)
  * [Autenticação por apelido](#alias-auth)
  * [Gerando uma senha de apelido](#generating-an-alias-password)
* [Todas as 68 ferramentas](#all-68-tools)
  * [Conta (Chave de API ou Autenticação de Apelido)](#account-api-key-or-alias-auth)
  * [Domínios (Chave de API)](#domains-api-key)
  * [Apelidos (Chave de API)](#aliases-api-key)
  * [E-mails — SMTP de saída (Chave de API; Enviar suporta ambos)](#emails--outbound-smtp-api-key-send-supports-both)
  * [Mensagens — IMAP (Autenticação de Apelido)](#messages--imap-alias-auth)
  * [Pastas — IMAP (Autenticação de Apelido)](#folders--imap-alias-auth)
  * [Contatos — CardDAV (Autenticação de Apelido)](#contacts--carddav-alias-auth)
  * [Calendários — CalDAV (Autenticação de Apelido)](#calendars--caldav-alias-auth)
  * [Eventos de Calendário — CalDAV (Autenticação de Apelido)](#calendar-events--caldav-alias-auth)
  * [Scripts Sieve (Chave de API)](#sieve-scripts-api-key)
  * [Scripts Sieve (Autenticação de Apelido)](#sieve-scripts-alias-auth)
  * [Membros do Domínio e Convites (Chave de API)](#domain-members-and-invites-api-key)
  * [Senhas Catch-All (Chave de API)](#catch-all-passwords-api-key)
  * [Registros (Chave de API)](#logs-api-key)
  * [Criptografar (Sem Autenticação)](#encrypt-no-auth)
* [20 Casos de Uso Reais](#20-real-world-use-cases)
* [Exemplos de Prompts](#example-prompts)
* [Variáveis de Ambiente](#environment-variables)
* [Segurança](#security)
* [Uso Programático](#programmatic-usage)
* [Código Aberto](#open-source)


## O que é MCP? {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io) (MCP) é um padrão aberto criado pela Anthropic que permite que modelos de IA chamem ferramentas externas de forma segura. Em vez de copiar e colar respostas da API em uma janela de chat, o MCP dá ao modelo acesso direto e estruturado aos seus serviços.

Nosso servidor MCP envolve toda a [API do Forward Email](/email-api) — cada endpoint, cada parâmetro — e os expõe como ferramentas que qualquer cliente compatível com MCP pode usar. O servidor é executado localmente em sua máquina usando transporte stdio. Suas credenciais permanecem em suas variáveis de ambiente e nunca são enviadas para o modelo de IA.


## Início rápido {#quick-start}

### Obter uma chave de API {#get-an-api-key}

1. Faça login em sua [conta Forward Email](/my-account/domains).
2. Vá para **Minha Conta** → **Segurança** → **Chaves de API**.
3. Gere uma nova chave de API e copie-a.

### Claude Desktop {#claude-desktop}

Adicione isso ao seu arquivo de configuração do Claude Desktop:

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

> **Nota:** As variáveis `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD` são opcionais, mas necessárias para ferramentas de caixa de correio (mensagens, pastas, contatos, calendários). Consulte [Autenticação](#authentication) para obter detalhes.

### Cursor {#cursor}

Abra as Configurações do Cursor → MCP → Adicionar Servidor:

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

Abra as Configurações do Windsurf → MCP → Adicionar Servidor com a mesma configuração acima.

### Outros clientes MCP {#other-mcp-clients}

Qualquer cliente que suporte o transporte stdio do MCP funcionará. O comando é:

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## Autenticação {#authentication}

A API do Forward Email usa **autenticação HTTP Basic** com dois tipos diferentes de credenciais, dependendo do endpoint. O servidor MCP lida com isso automaticamente — você só precisa fornecer as credenciais corretas.

### Autenticação por chave de API {#api-key-auth}

A maioria dos endpoints de gerenciamento (domínios, apelidos, e-mails de saída, logs) usa sua **chave de API** como nome de usuário da autenticação Basic com uma senha vazia.

Esta é a mesma chave de API que você usa para a API REST. Defina-a através da variável de ambiente `FORWARD_EMAIL_API_KEY`.

### Autenticação por apelido {#alias-auth}

Os endpoints da caixa de correio (mensagens, pastas, contatos, calendários, scripts Sieve com escopo de apelido) usam **credenciais de apelido** — o endereço de e-mail do apelido como nome de usuário e uma senha gerada como senha.

Esses endpoints acessam dados por apelido via protocolos IMAP, CalDAV e CardDAV. Eles exigem o e-mail do apelido e uma senha gerada, não a chave de API.

Você pode fornecer credenciais de apelido de duas maneiras:

1. **Variáveis de ambiente** (recomendado para apelido padrão): Defina `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD`.
2. **Parâmetros por chamada de ferramenta**: Passe `alias_username` e `alias_password` como argumentos para qualquer ferramenta de autenticação de apelido. Estes substituem as variáveis de ambiente, o que é útil ao trabalhar com vários apelidos.

### Gerando uma senha de apelido {#generating-an-alias-password}

Antes de poder usar as ferramentas de autenticação de apelido, você precisa gerar uma senha para o apelido. Você pode fazer isso com a ferramenta `generateAliasPassword` ou via API:

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

A resposta inclui os campos `username` (e-mail do apelido) e `password`. Use-os como suas credenciais de apelido.

> **Dica:** Você também pode perguntar ao seu assistente de IA: *"Gerar uma senha para o usuário de apelido@example.com no domínio example.com"* — ele chamará a ferramenta `generateAliasPassword` e retornará as credenciais.

A tabela abaixo resume qual método de autenticação cada grupo de ferramentas exige:

| Grupo de Ferramentas | Método de Autenticação | Credenciais |
|-----------|-------------|-------------|
| Conta | Chave de API **ou** Autenticação de Apelido | Qualquer um |
| Domínios, Apelidos, Membros do Domínio, Convites, Senhas Catch-All | Chave de API | `FORWARD_EMAIL_API_KEY` |
| E-mails de Saída (listar, obter, excluir, limitar) | Chave de API | `FORWARD_EMAIL_API_KEY` |
| Enviar E-mail | Chave de API **ou** Autenticação de Apelido | Qualquer um |
| Mensagens (IMAP) | Autenticação de Apelido | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Pastas (IMAP) | Autenticação de Apelido | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Contatos (CardDAV) | Autenticação de Apelido | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Calendários (CalDAV) | Autenticação de Apelido | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Eventos de Calendário (CalDAV) | Autenticação de Apelido | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Scripts Sieve (com escopo de domínio) | Chave de API | `FORWARD_EMAIL_API_KEY` |
| Scripts Sieve (com escopo de apelido) | Autenticação de Apelido | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Registros | Chave de API | `FORWARD_EMAIL_API_KEY` |
| Criptografar | Nenhum | Nenhuma credencial necessária |


## Todas as 68 ferramentas {#all-68-tools}

Cada ferramenta mapeia diretamente para um endpoint da [API do Forward Email](/email-api). Os parâmetros usam os mesmos nomes que a documentação da API. O método de autenticação é observado em cada título de seção.

### Conta (Chave de API ou Autenticação de Apelido) {#account-api-key-or-alias-auth}

Com a autenticação por chave de API, estas retornam as informações da sua conta de usuário. Com a autenticação por apelido, elas retornam as informações do apelido/caixa de correio, incluindo cota de armazenamento e configurações.

| Ferramenta | Endpoint da API | Descrição |
|------|-------------|-------------|
| `getAccount` | `GET /v1/account` | Obtenha as informações da sua conta |
| `updateAccount` | `PUT /v1/account` | Atualize as configurações da sua conta |

### Domínios (Chave de API) {#domains-api-key}

| Ferramenta | Endpoint da API | Descrição |
|------|-------------|-------------|
| `listDomains` | `GET /v1/domains` | Liste todos os seus domínios |
| `createDomain` | `POST /v1/domains` | Adicione um novo domínio |
| `getDomain` | `GET /v1/domains/:domain_id` | Obtenha detalhes do domínio |
| `updateDomain` | `PUT /v1/domains/:domain_id` | Atualize as configurações do domínio |
| `deleteDomain` | `DELETE /v1/domains/:domain_id` | Remova um domínio |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records` | Verifique os registros DNS |
| `verifySmtpRecords` | `GET /v1/domains/:domain_id/verify-smtp` | Verifique a configuração SMTP |
| `testS3Connection` | `POST /v1/domains/:domain_id/test-s3-connection` | Teste o armazenamento S3 personalizado |

### Apelidos (Chave de API) {#aliases-api-key}

| Ferramenta | Endpoint da API | Descrição |
|------|-------------|-------------|
| `listAliases` | `GET /v1/domains/:domain_id/aliases` | Liste os apelidos para um domínio |
| `createAlias` | `POST /v1/domains/:domain_id/aliases` | Crie um novo apelido |
| `getAlias` | `GET /v1/domains/:domain_id/aliases/:alias_id` | Obtenha detalhes do apelido |
| `updateAlias` | `PUT /v1/domains/:domain_id/aliases/:alias_id` | Atualize um apelido |
| `deleteAlias` | `DELETE /v1/domains/:domain_id/aliases/:alias_id` | Exclua um apelido |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | Gere senha IMAP/SMTP para autenticação de apelido |

### E-mails — SMTP de saída (Chave de API; Enviar suporta ambos) {#emails--outbound-smtp-api-key-send-supports-both}

| Ferramenta | Endpoint da API | Autenticação | Descrição |
|------|-------------|------|-------------|
| `sendEmail` | `POST /v1/emails` | Chave de API ou Autenticação de Apelido | Envie um e-mail via SMTP |
| `listEmails` | `GET /v1/emails` | Chave de API | Liste e-mails de saída |
| `getEmail` | `GET /v1/emails/:id` | Chave de API | Obtenha detalhes e status do e-mail |
| `deleteEmail` | `DELETE /v1/emails/:id` | Chave de API | Exclua um e-mail em fila |
| `getEmailLimit` | `GET /v1/emails/limit` | Chave de API | Verifique seu limite de envio |

A ferramenta `sendEmail` aceita `from`, `to`, `cc`, `bcc`, `subject`, `text`, `html` e `attachments`. Isso é o mesmo que o endpoint `POST /v1/emails`.

### Mensagens — IMAP (Autenticação de Apelido) {#messages--imap-alias-auth}

> **Requer credenciais de apelido.** Passe `alias_username` e `alias_password` ou defina as variáveis de ambiente `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Ferramenta | Endpoint da API | Descrição |
|------|-------------|-------------|
| `listMessages` | `GET /v1/messages` | Liste e pesquise mensagens em uma caixa de correio |
| `createMessage` | `POST /v1/messages` | Crie um rascunho ou carregue uma mensagem |
| `getMessage` | `GET /v1/messages/:id` | Obtenha uma mensagem por ID |
| `updateMessage` | `PUT /v1/messages/:id` | Atualize sinalizadores (lido, marcado com estrela, etc.) |
| `deleteMessage` | `DELETE /v1/messages/:id` | Exclua uma mensagem |

A ferramenta `listMessages` suporta mais de 15 parâmetros de pesquisa, incluindo `subject`, `from`, `to`, `text`, `since`, `before`, `is_unread` e `has_attachment`. Consulte a [documentação da API](/email-api) para a lista completa.

### Pastas — IMAP (Autenticação de Apelido) {#folders--imap-alias-auth}

> **Requer credenciais de apelido.** Passe `alias_username` e `alias_password` ou defina as variáveis de ambiente `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Ferramenta | Endpoint da API | Descrição |
|------|-------------|-------------|
| `listFolders` | `GET /v1/folders` | Liste todas as pastas da caixa de correio |
| `createFolder` | `POST /v1/folders` | Crie uma nova pasta |
| `getFolder` | `GET /v1/folders/:id` | Obtenha detalhes da pasta |
| `updateFolder` | `PUT /v1/folders/:id` | Renomeie uma pasta |
| `deleteFolder` | `DELETE /v1/folders/:id` | Exclua uma pasta |

### Contatos — CardDAV (Autenticação de Apelido) {#contacts--carddav-alias-auth}

> **Requer credenciais de apelido.** Passe `alias_username` e `alias_password` ou defina as variáveis de ambiente `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Ferramenta | Endpoint da API | Descrição |
|------|-------------|-------------|
| `listContacts` | `GET /v1/contacts` | Liste todos os contatos |
| `createContact` | `POST /v1/contacts` | Crie um novo contato |
| `getContact` | `GET /v1/contacts/:id` | Obtenha detalhes do contato |
| `updateContact` | `PUT /v1/contacts/:id` | Atualize um contato |
| `deleteContact` | `DELETE /v1/contacts/:id` | Exclua um contato |

### Calendários — CalDAV (Autenticação de Apelido) {#calendars--caldav-alias-auth}

> **Requer credenciais de apelido.** Passe `alias_username` e `alias_password` ou defina as variáveis de ambiente `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Ferramenta | Endpoint da API | Descrição |
|------|-------------|-------------|
| `listCalendars` | `GET /v1/calendars` | Liste todos os calendários |
| `createCalendar` | `POST /v1/calendars` | Crie um novo calendário |
| `getCalendar` | `GET /v1/calendars/:id` | Obtenha detalhes do calendário |
| `updateCalendar` | `PUT /v1/calendars/:id` | Atualize um calendário |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | Exclua um calendário |

### Eventos de Calendário — CalDAV (Autenticação de Apelido) {#calendar-events--caldav-alias-auth}

> **Requer credenciais de apelido.** Passe `alias_username` e `alias_password` ou defina as variáveis de ambiente `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Ferramenta | Endpoint da API | Descrição |
|------|-------------|-------------|
| `listCalendarEvents` | `GET /v1/calendar-events` | Liste todos os eventos |
| `createCalendarEvent` | `POST /v1/calendar-events` | Crie um novo evento |
| `getCalendarEvent` | `GET /v1/calendar-events/:id` | Obtenha detalhes do evento |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id` | Atualize um evento |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | Exclua um evento |

### Scripts Sieve (Chave de API) {#sieve-scripts-api-key}

Estes usam caminhos com escopo de domínio e autenticam com sua chave de API.

| Ferramenta | Endpoint da API | Descrição |
|------|-------------|-------------|
| `listSieveScripts` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve` | Liste scripts para um apelido |
| `createSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve` | Crie um novo script |
| `getSieveScript` | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Obtenha detalhes do script |
| `updateSieveScript` | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Atualize um script |
| `deleteSieveScript` | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id` | Exclua um script |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | Ative um script |

### Scripts Sieve (Autenticação de Apelido) {#sieve-scripts-alias-auth}

Estes usam autenticação de nível de apelido. Útil para automação por apelido sem a necessidade da chave de API.

> **Requer credenciais de apelido.** Passe `alias_username` e `alias_password` ou defina as variáveis de ambiente `FORWARD_EMAIL_ALIAS_USER` e `FORWARD_EMAIL_ALIAS_PASSWORD`.

| Ferramenta | Endpoint da API | Descrição |
|------|-------------|-------------|
| `listSieveScriptsAliasAuth` | `GET /v1/sieve-scripts` | Liste scripts |
| `createSieveScriptAliasAuth` | `POST /v1/sieve-scripts` | Crie um script |
| `getSieveScriptAliasAuth` | `GET /v1/sieve-scripts/:script_id` | Obtenha detalhes do script |
| `updateSieveScriptAliasAuth` | `PUT /v1/sieve-scripts/:script_id` | Atualize um script |
| `deleteSieveScriptAliasAuth` | `DELETE /v1/sieve-scripts/:script_id` | Exclua um script |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | Ative um script |

### Membros do Domínio e Convites (Chave de API) {#domain-members-and-invites-api-key}

| Ferramenta | Endpoint da API | Descrição |
|------|-------------|-------------|
| `updateDomainMember` | `PUT /v1/domains/:domain_id/members/:member_id` | Altere a função de um membro |
| `removeDomainMember` | `DELETE /v1/domains/:domain_id/members/:member_id` | Remova um membro |
| `acceptDomainInvite` | `GET /v1/domains/:domain_id/invites` | Aceite um convite pendente |
| `createDomainInvite` | `POST /v1/domains/:domain_id/invites` | Convide alguém para um domínio |
| `removeDomainInvite` | `DELETE /v1/domains/:domain_id/invites` | Revogue um convite |

### Senhas Catch-All (Chave de API) {#catch-all-passwords-api-key}

| Ferramenta | Endpoint da API | Descrição |
|------|-------------|-------------|
| `listCatchAllPasswords` | `GET /v1/domains/:domain_id/catch-all-passwords` | Liste senhas catch-all |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords` | Crie uma senha catch-all |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | Exclua uma senha catch-all |

### Registros (Chave de API) {#logs-api-key}

| Ferramenta | Endpoint da API | Descrição |
|------|-------------|-------------|
| `downloadLogs` | `GET /v1/logs/download` | Baixe os logs de entrega de e-mail |

### Criptografar (Sem Autenticação) {#encrypt-no-auth}

| Ferramenta | Endpoint da API | Descrição |
|------|-------------|-------------|
| `encryptRecord` | `POST /v1/encrypt` | Criptografe um registro DNS TXT |

Esta ferramenta não requer autenticação. Ela criptografa registros de encaminhamento como `forward-email=user@example.com` para uso em registros DNS TXT.


## 20 Casos de Uso Reais {#20-real-world-use-cases}

Aqui estão maneiras práticas de usar o servidor MCP com seu assistente de IA:

### 1. Triagem de E-mail {#1-email-triage}

Peça à sua IA para escanear sua caixa de entrada e resumir as mensagens não lidas. Ela pode sinalizar e-mails urgentes, categorizar por remetente e redigir respostas — tudo por meio de linguagem natural. *(Requer credenciais de apelido para acesso à caixa de entrada.)*

### 2. Automação da Configuração de Domínio {#2-domain-setup-automation}

Configurando um novo domínio? Peça à IA para criar o domínio, adicionar seus apelidos, verificar os registros DNS e testar a configuração SMTP. O que normalmente leva 10 minutos clicando em painéis se torna uma conversa.

### 3. Gerenciamento de Apelidos em Massa {#3-bulk-alias-management}

Precisa criar 20 apelidos para um novo projeto? Descreva o que você precisa e deixe a IA lidar com o trabalho repetitivo. Ela pode criar apelidos, definir regras de encaminhamento e gerar senhas de uma só vez.

### 4. Monitoramento de Campanhas de E-mail {#4-email-campaign-monitoring}

Peça à sua IA para verificar os limites de envio, listar os e-mails de saída recentes e relatar o status de entrega. Útil para monitorar a saúde do e-mail transacional.

### 5. Sincronização e Limpeza de Contatos {#5-contact-sync-and-cleanup}

Use as ferramentas CardDAV para listar todos os contatos, encontrar duplicatas, atualizar informações desatualizadas ou criar contatos em massa a partir de uma planilha que você cola no chat. *(Requer credenciais de apelido.)*

### 6. Gerenciamento de Calendário {#6-calendar-management}

Crie calendários, adicione eventos, atualize horários de reuniões e exclua eventos cancelados — tudo por meio de conversação. As ferramentas CalDAV suportam CRUD completo em calendários e eventos. *(Requer credenciais de apelido.)*

### 7. Automação de Script Sieve {#7-sieve-script-automation}

Os scripts Sieve são poderosos, mas a sintaxe é arcana. Peça à sua IA para escrever scripts Sieve para você: "Filtrar todos os e-mails de billing@example.com para uma pasta de Faturamento" se torna um script funcional sem tocar na especificação RFC 5228.

### 8. Integração de Equipe {#8-team-onboarding}

Quando um novo membro da equipe se junta, peça à IA para criar seu apelido, gerar uma senha, enviar-lhe um e-mail de boas-vindas com suas credenciais e adicioná-lo como membro do domínio. Um prompt, quatro chamadas de API.

### 9. Auditoria de Segurança {#9-security-auditing}

Peça à sua IA para listar todos os domínios, verificar o status de verificação DNS, revisar as configurações de apelido e identificar quaisquer domínios com registros não verificados. Uma varredura de segurança rápida em linguagem natural.

### 10. Configuração de Encaminhamento de E-mail {#10-email-forwarding-setup}

Configurando o encaminhamento de e-mail para um novo domínio? Peça à IA para criar o domínio, adicionar apelidos de encaminhamento, criptografar os registros DNS e verificar se tudo está configurado corretamente.

### 11. Pesquisa e Análise da Caixa de Entrada {#11-inbox-search-and-analysis}

Use as ferramentas de pesquisa de mensagens para encontrar e-mails específicos: "Encontre todos os e-mails de john@example.com nos últimos 30 dias que tenham anexos." Os mais de 15 parâmetros de pesquisa tornam isso poderoso. *(Requer credenciais de apelido.)*

### 12. Organização de Pastas {#12-folder-organization}

Peça à sua IA para criar uma estrutura de pastas para um novo projeto, mover mensagens entre pastas ou limpar pastas antigas que você não precisa mais. *(Requer credenciais de apelido.)*

### 13. Rotação de Senhas {#13-password-rotation}

Gere novas senhas de apelido em um cronograma. Peça à sua IA para gerar uma nova senha para cada apelido e relatar as novas credenciais.

### 14. Criptografia de Registro DNS {#14-dns-record-encryption}

Criptografe seus registros de encaminhamento antes de adicioná-los ao DNS. A ferramenta `encryptRecord` lida com isso sem autenticação — útil para criptografias rápidas e únicas.

### 15. Análise de Log de Entrega {#15-delivery-log-analysis}

Baixe seus logs de entrega de e-mail e peça à IA para analisar as taxas de rejeição, identificar destinatários problemáticos ou rastrear os tempos de entrega.

### 16. Gerenciamento de Vários Domínios {#16-multi-domain-management}

Se você gerencia vários domínios, peça à IA para lhe dar um relatório de status: quais domínios são verificados, quais têm problemas, quantos apelidos cada um tem e como são os limites de envio.

### 17. Configuração Catch-All {#17-catch-all-configuration}

Configure senhas catch-all para domínios que precisam receber e-mail em qualquer endereço. A IA pode criar, listar e gerenciar essas senhas para você.

### 18. Gerenciamento de Convites de Domínio {#18-domain-invite-management}

Convide membros da equipe para gerenciar domínios, verificar convites pendentes e limpar os expirados. Útil para organizações com vários administradores de domínio.

### 19. Teste de Armazenamento S3 {#19-s3-storage-testing}

Se você usa armazenamento S3 personalizado para backups de e-mail, peça à IA para testar a conexão e verificar se está funcionando corretamente.

### 20. Composição de Rascunho de E-mail {#20-email-draft-composition}

Crie rascunhos de e-mail em sua caixa de correio sem enviá-los. Útil para preparar e-mails que precisam de revisão antes do envio, ou para construir modelos de e-mail. *(Requer credenciais de apelido.)*


## Exemplos de Prompts {#example-prompts}

Aqui estão prompts que você pode usar diretamente com seu assistente de IA:

**Enviando e-mail:**
> "Envie um e-mail de hello@mydomain.com para john@example.com com o assunto 'Reunião Amanhã' e corpo 'Olá John, ainda estamos de pé para as 14h?'"

**Gerenciamento de domínio:**
> "Liste todos os meus domínios e diga-me quais têm registros DNS não verificados."

**Criação de apelido:**
> "Crie um novo apelido support@mydomain.com que encaminhe para meu e-mail pessoal."

**Pesquisa na caixa de entrada (requer credenciais de apelido):**
> "Encontre todos os e-mails não lidos da última semana que mencionam 'fatura'."

**Calendário (requer credenciais de apelido):**
> "Crie um calendário chamado 'Trabalho' e adicione uma reunião para amanhã às 14h chamada 'Reunião Diária da Equipe'."

**Scripts Sieve:**
> "Escreva um script Sieve para info@mydomain.com que responda automaticamente a e-mails com 'Obrigado por entrar em contato, responderemos em 24 horas.'"

**Operações em massa:**
> "Crie apelidos para sales@, support@, billing@ e info@ em mydomain.com, todos encaminhando para team@mydomain.com."

**Verificação de segurança:**
> "Verifique o status de verificação DNS e SMTP para todos os meus domínios e diga-me se algo precisa de atenção."

**Gerar senha de apelido:**
> "Gere uma senha para o apelido user@example.com para que eu possa acessar minha caixa de entrada."


## Variáveis de Ambiente {#environment-variables}

| Variável | Obrigatório | Padrão | Descrição |
|----------|----------|---------|-------------|
| `FORWARD_EMAIL_API_KEY` | Sim | — | Sua chave de API do Forward Email (usada como nome de usuário de autenticação Basic para endpoints de chave de API) |
| `FORWARD_EMAIL_ALIAS_USER` | Não | — | Endereço de e-mail do apelido para endpoints da caixa de correio (por exemplo, `user@example.com`) |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | Não | — | Senha de apelido gerada para endpoints da caixa de correio |
| `FORWARD_EMAIL_API_URL` | Não | `https://api.forwardemail.net` | URL base da API (para auto-hospedagem ou teste) |


## Segurança {#security}

O servidor MCP é executado localmente em sua máquina. Veja como a segurança funciona:

*   **Suas credenciais permanecem locais.** Tanto sua chave de API quanto as credenciais de apelido são lidas de variáveis de ambiente e usadas para autenticar solicitações de API via autenticação HTTP Basic. Elas nunca são enviadas para o modelo de IA.
*   **Transporte stdio.** O servidor se comunica com o cliente de IA via stdin/stdout. Nenhuma porta de rede é aberta.
*   **Sem armazenamento de dados.** O servidor é sem estado. Ele não armazena em cache, registra ou armazena nenhum de seus dados de e-mail.
*   **Código aberto.** Todo o código-fonte está no [GitHub](https://github.com/forwardemail/mcp-server). Você pode auditar cada linha.


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

O Forward Email MCP Server é [código aberto no GitHub](https://github.com/forwardemail/mcp-server) sob a licença BUSL-1.1. Acreditamos na transparência. Se você encontrar um bug ou quiser um recurso, [abra uma issue](https://github.com/forwardemail/mcp-server/issues).
