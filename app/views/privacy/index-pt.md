# Política de Privacidade {#privacy-policy}

<!-- <img loading="lazy" src="/img/articles/privacy.webp" alt="Política de privacidade do Forward Email" class="rounded-lg" /> -->


## Índice {#table-of-contents}

* [Aviso Legal](#disclaimer)
* [Informações Não Coletadas](#information-not-collected)
* [Informações Coletadas](#information-collected)
  * [Informações da Conta](#account-information)
  * [Armazenamento de Email](#email-storage)
  * [Logs de Erro](#error-logs)
  * [Logs do Servidor](#server-logs)
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
* [Aplicativos e Webmail](#apps-and-webmail)
  * [Dados no seu Dispositivo](#data-on-your-device)
  * [Dados que os Aplicativos nos Enviam](#data-the-apps-send-us)
  * [Notificações Push](#push-notifications)
  * [Imagens e Links nos Emails](#images-and-links-in-emails)
  * [Outras Conexões](#other-connections)
* [Informações Compartilhadas](#information-shared)
* [Remoção de Informações](#information-removal)
* [Divulgações Adicionais](#additional-disclosures)


## Aviso Legal {#disclaimer}

Por favor, consulte nossos [Termos](/terms) conforme aplicável em todo o site.


## Informações Não Coletadas {#information-not-collected}

**Com exceção das informações expressamente descritas nesta política (incluindo [logs de erro](#error-logs), [logs do servidor](#server-logs), [e-mails SMTP de saída](#outbound-smtp-emails), [informações da conta](#account-information), [processamento temporário de dados](#temporary-data-processing), [logs de auditoria](#audit-logs), [cookies e sessões](#cookies-and-sessions), [análises](#analytics) e [aplicativos e webmail](#apps-and-webmail)):**

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
* A primeira página que você visitou em nosso site, com valores no caminho, como nomes de domínio, IDs e tokens, substituídos por espaços reservados
* Parâmetros de campanha UTM se presentes na URL

### Armazenamento de Email {#email-storage}

* Armazenamos emails e informações de calendário em seu [banco de dados SQLite criptografado](/blog/docs/best-quantum-safe-encrypted-email-service) estritamente para seu acesso IMAP/POP3/CalDAV/CardDAV e funcionalidade da caixa de correio.
  * Note que se você estiver usando apenas nossos serviços de encaminhamento de email, então nenhum email é armazenado em disco ou banco de dados conforme descrito em [Informações Não Coletadas](#information-not-collected).
  * Nossos serviços de encaminhamento de email operam apenas em memória (sem gravação em armazenamento de disco nem bancos de dados).
  * O armazenamento IMAP/POP3/CalDAV/CardDAV é criptografado em repouso, criptografado em trânsito, e armazenado em disco criptografado com LUKS.
  * Backups do seu armazenamento IMAP/POP3/CalDAV/CardDAV são criptografados em repouso, criptografados em trânsito, e armazenados no [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/).

### Logs de Erro {#error-logs}

* Armazenamos [logs de erro](/faq#do-you-store-error-logs) com códigos de resposta SMTP `4xx` e `5xx` por 7 dias.
* Logs de erro contêm o erro SMTP, envelope e cabeçalhos do email (nós **não** armazenamos o corpo do email nem anexos).
* Logs de erro podem conter endereços IP e nomes de host dos servidores remetentes para fins de depuração.
* Logs de erro para [limitação de taxa](/faq#do-you-have-rate-limiting) e [greylisting](/faq#do-you-have-a-greylist) não são acessíveis pois a conexão termina cedo (ex.: antes dos comandos `RCPT TO` e `MAIL FROM` serem transmitidos).
* Também armazenamos logs de erro de solicitações ao site e à API que falham ou demoram demais, e de erros nos nossos servidores IMAP, POP3, CalDAV e CardDAV, por 7 dias.
* Esses logs podem conter o endereço IP, a URL da solicitação (incluindo parâmetros de consulta, como termos de pesquisa), cabeçalhos da solicitação, como o user agent, e a conta ou o alias envolvidos.
* Senhas, tokens de API, cookies e corpos de solicitações são removidos desses logs antes do armazenamento.

### Logs do Servidor {#server-logs}

* Nossos servidores gravam uma linha de log para cada solicitação ao site e à API, que pode incluir o endereço IP, o método e a URL da solicitação (incluindo parâmetros de consulta), cabeçalhos da solicitação, o status da resposta e a conta conectada.
* Usamos esses logs para encontrar e corrigir problemas e para impedir abusos, e os mantemos por até 30 dias.

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
  * [Análises](#analytics): a primeira página da sua visita, o domínio de referência, os parâmetros de campanha (UTM) e uma contagem de páginas


## Analytics {#analytics}

Usamos nosso próprio sistema de análise focado em privacidade para entender como nossos serviços são utilizados. Este sistema foi projetado com a privacidade como princípio central:

**O que NÃO coletamos:**

* Não armazenamos endereços IP
* Não definimos um cookie separado para análise
* Não utilizamos serviços de análise de terceiros
* Não rastreamos visitantes ao longo dos dias ou sessões quando não estão conectados

**O que COLETAMOS:**

* Visualizações agregadas de páginas e uso do serviço (SMTP, IMAP, POP3, API, etc.)
* Tipo e versão de navegador e sistema operacional (analisados a partir do user agent, dados brutos descartados)
* Tipo de dispositivo (desktop, móvel, tablet)
* Domínio de referência (não a URL completa) e parâmetros de campanha (UTM)
* Tipo de cliente de email para protocolos de correio (ex.: Thunderbird, Outlook)
* A página ou o caminho da API solicitado, em que valores como nomes de domínio, IDs e tokens são substituídos por espaços reservados, e se a solicitação foi bem-sucedida
* Em visitas ao site, a primeira página da visita e uma contagem de páginas, mantidas na sua sessão (veja [Cookies e Sessões](#cookies-and-sessions))
* Quando você está conectado, o ID da sua conta, alias ou domínio, para que possamos ver como cada serviço é usado e solucionar problemas

**Retenção de dados:**

* Eventos de análise são automaticamente excluídos após 30 dias
* Totais por hora, que não estão vinculados a nenhuma conta, são mantidos por 90 dias
* Identificadores de sessão rotacionam diariamente e não podem ser usados para rastrear visitantes ao longo dos dias


## Aplicativos e Webmail {#apps-and-webmail}

Esta seção abrange nossos aplicativos de email para iOS, Android, macOS, Windows e Linux, e nosso webmail em <a href="https://mail.forwardemail.net" target="_blank" rel="noopener noreferrer">mail.forwardemail.net</a>, que compartilham o mesmo código. Os aplicativos não contêm código de publicidade nem de rastreamento, nem análises de terceiros.

### Dados no seu Dispositivo {#data-on-your-device}

* Os aplicativos armazenam seus emails, contatos, calendários, configurações e dados de login no seu dispositivo, para que carreguem rapidamente e funcionem offline.
* Se você ativar o App Lock, o aplicativo criptografa o conteúdo dos emails, os contatos e os dados de login armazenados com uma chave protegida pelo seu PIN ou pela sua chave de acesso. Datas, pastas, etiquetas e sinalizadores permanecem sem criptografia para que o aplicativo possa ordenar e contar seus emails.
* Ao sair de uma conta, os dados dela são removidos do seu dispositivo.

### Dados que os Aplicativos nos Enviam {#data-the-apps-send-us}

* O endereço de email e a senha do seu alias, a cada solicitação, para fazer seu login.
* Os emails, contatos, calendários, etiquetas e filtros que você envia, cria ou altera. Armazenamos emails, contatos e calendários conforme descrito em [Armazenamento de Email](#email-storage), e os emails que você envia conforme descrito em [Emails SMTP de Saída](#outbound-smtp-emails).
* Seus termos de pesquisa, para que possamos pesquisar sua caixa de correio em nossos servidores. Os termos de pesquisa fazem parte da URL da solicitação, por isso podem aparecer nos [logs de erro](#error-logs) e nos [logs do servidor](#server-logs).
* Os comentários que você decidir enviar pelo aplicativo, que são enviados por email do seu alias para nossa equipe de suporte com os detalhes de diagnóstico que você decidir incluir.
* Os emails que você denunciar como spam, que o aplicativo encaminha para nossa equipe de abuso (ou para outro endereço que você definir em Settings).

### Notificações Push {#push-notifications}

* Quando você permite notificações, o aplicativo registra um token push conosco. Nós o armazenamos com a plataforma, o alias e a conta correspondentes, o momento da última entrega e um nome de dispositivo obtido do user agent do aplicativo, que inclui a versão do seu sistema operacional e, no Android, o modelo do seu dispositivo.
* Mantemos um token push por até um ano após o último uso. Nós o excluímos antes quando você sai da conta no aplicativo, quando a entrega falha três vezes seguidas, quando a senha do alias é alterada, quando você exclui o alias ou sua conta, ou quando o alias passa para outro proprietário.
* No iOS e no macOS, as notificações passam pelo Apple Push Notification service. No nosso aplicativo Android do Google Play, elas passam pelo Firebase Cloud Messaging. As notificações de novos emails incluem o nome e o endereço do remetente, o assunto, uma breve prévia e o nome da pasta, também para emails que chegam sem alerta, como os que são colocados nas pastas Lixo Eletrônico ou Enviados. Quando emails, calendários ou contatos mudam, também enviamos notificações silenciosas com identificadores, mas sem conteúdo de email, para que o aplicativo se mantenha atualizado.
* Com o [UnifiedPush](https://unifiedpush.org/) no Android, e com as notificações em um navegador web, cada notificação é criptografada para que apenas o seu dispositivo possa lê-la.
* Nosso aplicativo Android do Google Play inclui o Firebase Cloud Messaging, que envia ao Google um ID de instalação do Firebase, a versão do aplicativo e detalhes do dispositivo e do SDK. Nosso aplicativo Android do GitHub, sem serviços do Google, não inclui o Firebase.

### Imagens e Links nos Emails {#images-and-links-in-emails}

* As imagens nos emails são carregadas dos servidores do remetente, que podem ver seu endereço IP e quando as imagens foram carregadas.
* Os aplicativos bloqueiam pixels de rastreamento por padrão. Você também pode bloquear todas as imagens externas em Settings > Privacy & Security e depois carregá-las um email de cada vez.
* Os links nos emails abrem no seu navegador web.

### Outras Conexões {#other-connections}

* Nosso webmail consulta o GitHub para saber qual é a sua versão mais recente quando é carregado, quando você volta a ele e a cada 10 minutos enquanto está aberto. O About & Help consulta o GitHub para saber qual é a versão mais recente para desktop, e os aplicativos de desktop verificam se há atualizações no GitHub. O GitHub recebe seu endereço IP com essas solicitações.


## Informação Compartilhada {#information-shared}

Não compartilhamos suas informações com terceiros, exceto com prestadores de serviços que operam partes do nosso serviço, como Cloudflare (proteção do site e backups criptografados), Stripe e PayPal (pagamentos), e com os serviços que entregam notificações push aos seus dispositivos (veja [Notificações Push](#push-notifications)).

Podemos ser obrigados a cumprir solicitações legais ordenadas por tribunal (mas tenha em mente que [não coletamos as informações mencionadas acima em "Informações Não Coletadas"](#information-not-collected), portanto não poderemos fornecê-las desde o início).


## Remoção de Informações {#information-removal}

Se em algum momento desejar remover informações que você nos forneceu, vá para <a href="/my-account/security">Minha Conta > Segurança</a> e clique em "Excluir Conta".

Devido à prevenção e mitigação de abusos, sua conta pode exigir uma revisão manual de exclusão por nossos administradores se você a excluir dentro de 5 dias após seu primeiro pagamento.

Esse processo geralmente leva menos de 24 horas e foi implementado porque usuários estavam fazendo spam com nosso serviço e depois excluíam rapidamente suas contas – o que nos impedia de bloquear a(s) impressão(ões) do método de pagamento deles no Stripe.

Excluir sua conta também exclui os domínios que você administra, seus aliases e os tokens push registrados para eles. O registro da conta em si permanece, com o endereço de email, os dados de cobrança, a senha e as chaves de acesso removidos e com a autenticação de dois fatores e o token de API revogados, e mantemos seus registros de pagamento para reembolsos e contabilidade. Os logs e os dados de análise que fazem referência à sua conta são excluídos conforme os prazos descritos acima.

Para remover os dados dos aplicativos de um dispositivo, saia da conta no aplicativo ou desinstale-o.


## Divulgações Adicionais {#additional-disclosures}

Este site é protegido pela Cloudflare e sua [Política de Privacidade](https://www.cloudflare.com/privacypolicy/) e [Termos de Serviço](https://www.cloudflare.com/website-terms/) se aplicam.
