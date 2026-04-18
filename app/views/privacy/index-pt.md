# Política de Privacidade {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Política de privacidade do Forward Email" class="rounded-lg" />


## Índice {#table-of-contents}

* [Aviso Legal](#disclaimer)
* [Informações Não Coletadas](#information-not-collected)
* [Informações Coletadas](#information-collected)
  * [Informações da Conta](#account-information)
  * [Armazenamento de Email](#email-storage)
  * [Logs de Erro](#error-logs)
  * [Emails SMTP de Saída](#outbound-smtp-emails)
* [Processamento Temporário de Dados](#temporary-data-processing)
  * [Limitação de Taxa](#rate-limiting)
  * [Rastreamento de Conexão](#connection-tracking)
  * [Tentativas de Autenticação](#authentication-attempts)
* [Logs de Auditoria](#audit-logs)
  * [Alterações na Conta](#account-changes)
  * [Alterações nas Configurações de Domínio](#domain-settings-changes)
* [Cookies e Sessões](#cookies-and-sessions)
* [Análises](#analytics)
* [Informações Compartilhadas](#information-shared)
* [Remoção de Informações](#information-removal)
* [Divulgações Adicionais](#additional-disclosures)


## Aviso Legal {#disclaimer}

Por favor, consulte nossos [Termos](/terms) conforme aplicável em todo o site.


## Informações Não Coletadas {#information-not-collected}

**Com exceção das informações expressamente descritas nesta política — incluindo [logs de erro](#error-logs), [e-mails SMTP de saída](#outbound-smtp-emails), [informações da conta](#account-information), [processamento temporário de dados](#temporary-data-processing), [logs de auditoria](#audit-logs) e [cookies e sessões](#cookies-and-sessions):**

* Não armazenamos nenhum e-mail encaminhado em armazenamento em disco nem em bancos de dados.
* Não armazenamos nenhum metadado sobre e-mails encaminhados em armazenamento em disco nem em bancos de dados.
* Exceto conforme expressamente descrito nesta política, não armazenamos logs ou endereços IP em armazenamento em disco nem em bancos de dados.
* Não usamos nenhum serviço de análise ou telemetria de terceiros.


## Informações Coletadas {#information-collected}

Para transparência, a qualquer momento você pode <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">ver nosso código-fonte</a> para entender como as informações abaixo são coletadas e usadas.

**Estritamente para funcionalidade e para melhorar nosso serviço, coletamos e armazenamos com segurança as seguintes informações:**

### Informações da Conta {#account-information}

* Armazenamos o endereço de e-mail que você nos fornece.
* Armazenamos os seus nomes de domínio, aliases e configurações que você nos fornece.
* Armazenamos metadados limitados de segurança da conta necessários para proteger sua conta e gerenciar o acesso, incluindo identificadores de sessão de site ativos, contadores de tentativas de login falhas e o carimbo de data/hora da última tentativa de login.
* Quaisquer informações adicionais que você nos forneça voluntariamente, como comentários ou perguntas enviadas a nós por e-mail ou em nossa página de <a href="/help">ajuda</a>.


**Atribuição de cadastro** (armazenada permanentemente em sua conta):

Quando você cria uma conta, armazenamos as seguintes informações para entender como os usuários encontram nosso serviço:

* O domínio do site de referência (não a URL completa)
* A primeira página que você visitou em nosso site
* Parâmetros de campanha UTM se presentes na URL

### Armazenamento de Email {#email-storage}

* Armazenamos emails e informações de calendário em seu [banco de dados SQLite criptografado](/blog/docs/best-quantum-safe-encrypted-email-service) estritamente para seu acesso IMAP/POP3/CalDAV/CardDAV e funcionalidade da caixa de correio.
  * Note que se você estiver usando apenas nossos serviços de encaminhamento de email, então nenhum email é armazenado em disco ou banco de dados conforme descrito em [Informações Não Coletadas](#information-not-collected).
  * Nossos serviços de encaminhamento de email operam apenas em memória (sem gravação em armazenamento de disco nem bancos de dados).
  * O armazenamento IMAP/POP3/CalDAV/CardDAV é criptografado em repouso, criptografado em trânsito, e armazenado em disco criptografado com LUKS.
  * Backups do seu armazenamento IMAP/POP3/CalDAV/CardDAV são criptografados em repouso, criptografados em trânsito, e armazenados no [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/).

### Logs de Erro {#error-logs}

* Armazenamos logs de erro com códigos de resposta SMTP `4xx` e `5xx` por 7 dias.
* Logs de erro contêm o erro SMTP, envelope e cabeçalhos do email (nós **não** armazenamos o corpo do email nem anexos).
* Logs de erro podem conter endereços IP e nomes de host dos servidores remetentes para fins de depuração.
* Logs de erro para [limitação de taxa](/faq#do-you-have-rate-limiting) e [greylisting](/faq#do-you-have-a-greylist) não são acessíveis pois a conexão termina cedo (ex.: antes dos comandos `RCPT TO` e `MAIL FROM` serem transmitidos).
### Emails SMTP de Saída {#outbound-smtp-emails}

* Armazenamos [emails SMTP de saída](/faq#do-you-support-sending-email-with-smtp) por aproximadamente 30 dias.
  * Esse período varia com base no cabeçalho "Date"; já que permitimos que emails sejam enviados no futuro se existir um cabeçalho "Date" futuro.
  * **Note que, uma vez que um email é entregue com sucesso ou apresenta erro permanente, nós redigimos e apagamos o corpo da mensagem.**
  * Se você deseja configurar o corpo da mensagem do seu email SMTP de saída para ser retido por mais tempo que o padrão de 0 dias (após entrega bem-sucedida ou erro permanente), vá para Configurações Avançadas do seu domínio e insira um valor entre `0` e `30`.
  * Alguns usuários gostam de usar o recurso de visualização em [Minha Conta > Emails](/my-account/emails) para ver como seus emails são renderizados, portanto suportamos um período de retenção configurável.
  * Note que também suportamos [OpenPGP/E2EE](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).


## Processamento Temporário de Dados {#temporary-data-processing}

Os seguintes dados são processados temporariamente na memória ou Redis e **não** são armazenados permanentemente:

### Limitação de Taxa {#rate-limiting}

* Endereços IP são usados temporariamente no Redis para fins de limitação de taxa.
* Dados de limitação de taxa expiram automaticamente (normalmente dentro de 24 horas).
* Isso previne abusos e garante uso justo dos nossos serviços.

### Rastreamento de Conexão {#connection-tracking}

* Contagens de conexões simultâneas são rastreadas por endereço IP no Redis.
* Esses dados expiram automaticamente quando as conexões são fechadas ou após um curto tempo limite.
* Usado para prevenir abuso de conexão e garantir disponibilidade do serviço.

### Tentativas de Autenticação {#authentication-attempts}

* Tentativas de autenticação falhas são rastreadas por endereço IP no Redis.
* Também armazenamos metadados limitados de autenticação no nível da conta, incluindo contadores de tentativas de login falhas e o carimbo de data/hora da última tentativa de login.
* Os dados de tentativa de autenticação baseados no Redis expiram automaticamente (geralmente em 24 horas).
* Usado para evitar ataques de força bruta em contas de usuário.


## Logs de Auditoria {#audit-logs}

Para ajudar você a monitorar e proteger sua conta e domínios, mantemos logs de auditoria para certas alterações. Esses logs são usados para enviar emails de notificação aos titulares da conta e administradores de domínio.

### Alterações na Conta {#account-changes}

* Rastreiamo alterações em configurações importantes da conta (ex.: autenticação de dois fatores, nome de exibição, fuso horário).
* Quando alterações são detectadas, enviamos um email de notificação para seu endereço de email registrado.
* Campos sensíveis (ex.: senha, tokens de API, chaves de recuperação) são rastreados, mas seus valores são redigidos nas notificações.
* Entradas do log de auditoria são apagadas após o envio do email de notificação.

### Alterações nas Configurações do Domínio {#domain-settings-changes}

Para domínios com múltiplos administradores, fornecemos registro detalhado de auditoria para ajudar equipes a rastrear mudanças de configuração:

**O que rastreamos:**

* Alterações nas configurações do domínio (ex.: webhooks de bounce, filtragem de spam, configuração DKIM)
* Quem fez a alteração (endereço de email do usuário)
* Quando a alteração foi feita (timestamp)
* O endereço IP de onde a alteração foi feita
* A string do user-agent do navegador/cliente

**Como funciona:**

* Todos os administradores do domínio recebem um único email consolidado de notificação quando as configurações mudam.
* A notificação inclui uma tabela mostrando cada alteração com o usuário que a fez, seu endereço IP e timestamp.
* Campos sensíveis (ex.: chaves de webhook, tokens de API, chaves privadas DKIM) são rastreados, mas seus valores são redigidos.
* Informações do user-agent são incluídas em uma seção recolhível "Detalhes Técnicos".
* Entradas do log de auditoria são apagadas após o envio do email de notificação.

**Por que coletamos isso:**

* Para ajudar administradores de domínio a manter supervisão de segurança
* Para permitir que equipes auditem quem fez alterações de configuração
* Para auxiliar na resolução de problemas caso ocorram mudanças inesperadas
* Para fornecer responsabilidade na gestão compartilhada do domínio


## Cookies e Sessões {#cookies-and-sessions}

* Armazenamos cookies assinados, HTTP-only, e dados de sessão no lado do servidor para o tráfego do seu site.
* Os cookies usam a proteção SameSite.
* Armazenamos identificadores de sessão de site ativos em sua conta para dar suporte a recursos como "log out other devices" e invalidação de sessão relacionada à segurança.
* Os cookies de sessão expiram após 30 dias de inatividade.
* Não criamos sessões para bots ou rastreadores.
* Usamos cookies e sessões para:
  * Autenticação e estado de login
  * Funcionalidade "lembrar de mim" da autenticação de dois fatores
  * Mensagens flash e notificações


## Analytics {#analytics}

Usamos nosso próprio sistema de análise focado em privacidade para entender como nossos serviços são utilizados. Este sistema foi projetado com a privacidade como princípio central:

**O que NÃO coletamos:**

* Não armazenamos endereços IP
* Não usamos cookies ou identificadores persistentes para análise
* Não utilizamos serviços de análise de terceiros
* Não rastreamos usuários ao longo dos dias ou sessões

**O que COLETAMOS (anonimizado):**

* Visualizações agregadas de páginas e uso do serviço (SMTP, IMAP, POP3, API, etc.)
* Tipo de navegador e sistema operacional (analisado a partir do user agent, dados brutos descartados)
* Tipo de dispositivo (desktop, móvel, tablet)
* Domínio de referência (não a URL completa)
* Tipo de cliente de email para protocolos de correio (ex.: Thunderbird, Outlook)

**Retenção de dados:**

* Dados de análise são automaticamente excluídos após 30 dias
* Identificadores de sessão rotacionam diariamente e não podem ser usados para rastrear usuários ao longo dos dias


## Informação Compartilhada {#information-shared}

Não compartilhamos suas informações com terceiros.

Podemos ser obrigados a cumprir solicitações legais ordenadas por tribunal (mas tenha em mente que [não coletamos as informações mencionadas acima em "Informações Não Coletadas"](#information-not-collected), portanto não poderemos fornecê-las desde o início).


## Remoção de Informações {#information-removal}

Se em algum momento desejar remover informações que você nos forneceu, vá para <a href="/my-account/security">Minha Conta > Segurança</a> e clique em "Excluir Conta".

Devido à prevenção e mitigação de abusos, sua conta pode exigir uma revisão manual de exclusão por nossos administradores se você a excluir dentro de 5 dias após seu primeiro pagamento.

Esse processo geralmente leva menos de 24 horas e foi implementado porque usuários estavam fazendo spam com nosso serviço e depois excluíam rapidamente suas contas – o que nos impedia de bloquear a(s) impressão(ões) do método de pagamento deles no Stripe.


## Divulgações Adicionais {#additional-disclosures}

Este site é protegido pela Cloudflare e sua [Política de Privacidade](https://www.cloudflare.com/privacypolicy/) e [Termos de Serviço](https://www.cloudflare.com/website-terms/) se aplicam.
