# Como o Forward Email Protege Sua Privacidade, Domínio e Segurança: A Análise Técnica Profunda {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<img loading="lazy" src="/img/articles/email-forwarding.webp" alt="Comparação dos melhores serviços de encaminhamento de email" class="rounded-lg" />


## Índice {#table-of-contents}

* [Prefácio](#foreword)
* [A Filosofia de Privacidade do Forward Email](#the-forward-email-privacy-philosophy)
* [Implementação SQLite: Durabilidade e Portabilidade para Seus Dados](#sqlite-implementation-durability-and-portability-for-your-data)
* [Fila Inteligente e Mecanismo de Retentativa: Garantindo a Entrega de Emails](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [Recursos Ilimitados com Limitação de Taxa Inteligente](#unlimited-resources-with-intelligent-rate-limiting)
* [Criptografia em Sandbox para Segurança Aprimorada](#sandboxed-encryption-for-enhanced-security)
* [Processamento de Email em Memória: Sem Armazenamento em Disco para Máxima Privacidade](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [Criptografia de Ponta a Ponta com OpenPGP para Privacidade Completa](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [Proteção de Conteúdo em Múltiplas Camadas para Segurança Abrangente](#multi-layered-content-protection-for-comprehensive-security)
* [Como Diferimos de Outros Serviços de Email: A Vantagem Técnica de Privacidade](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [Transparência Open Source para Privacidade Verificável](#open-source-transparency-for-verifiable-privacy)
  * [Sem Vendor Lock-In para Privacidade Sem Compromissos](#no-vendor-lock-in-for-privacy-without-compromise)
  * [Dados em Sandbox para Isolamento Verdadeiro](#sandboxed-data-for-true-isolation)
  * [Portabilidade e Controle de Dados](#data-portability-and-control)
* [Os Desafios Técnicos do Encaminhamento de Email com Privacidade em Primeiro Lugar](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [Gerenciamento de Memória para Processamento de Email Sem Logs](#memory-management-for-no-logging-email-processing)
  * [Detecção de Spam Sem Análise de Conteúdo para Filtragem que Preserva a Privacidade](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [Mantendo Compatibilidade com Design Focado em Privacidade](#maintaining-compatibility-with-privacy-first-design)
* [Melhores Práticas de Privacidade para Usuários do Forward Email](#privacy-best-practices-for-forward-email-users)
* [Conclusão: O Futuro do Encaminhamento de Email Privado](#conclusion-the-future-of-private-email-forwarding)


## Prefácio {#foreword}

No cenário digital atual, a privacidade do email tornou-se mais crítica do que nunca. Com vazamentos de dados, preocupações com vigilância e publicidade direcionada baseada no conteúdo do email, os usuários buscam cada vez mais soluções que priorizem sua privacidade. No Forward Email, construímos nosso serviço do zero com a privacidade como pedra angular de nossa arquitetura. Este post no blog explora as implementações técnicas que tornam nosso serviço uma das soluções de encaminhamento de email mais focadas em privacidade disponíveis.


## A Filosofia de Privacidade do Forward Email {#the-forward-email-privacy-philosophy}

Antes de mergulhar nos detalhes técnicos, é importante entender nossa filosofia fundamental de privacidade: **seus emails pertencem a você e somente a você**. Este princípio orienta cada decisão técnica que tomamos, desde como lidamos com o encaminhamento de emails até como implementamos a criptografia.

Ao contrário de muitos provedores de email que escaneiam suas mensagens para fins publicitários ou as armazenam indefinidamente em seus servidores, o Forward Email opera com uma abordagem radicalmente diferente:

1. **Processamento apenas em memória** - Não armazenamos seus emails encaminhados em disco
2. **Sem armazenamento de metadados** - Não mantemos registros de quem está enviando email para quem
3. **100% open-source** - Todo nosso código é transparente e auditável
4. **Criptografia de ponta a ponta** - Suportamos OpenPGP para comunicações verdadeiramente privadas


## Implementação SQLite: Durabilidade e Portabilidade para Seus Dados {#sqlite-implementation-durability-and-portability-for-your-data}

Uma das maiores vantagens de privacidade do Forward Email é nossa implementação cuidadosamente projetada do [SQLite](https://en.wikipedia.org/wiki/SQLite). Ajustamos o SQLite com configurações específicas de PRAGMA e [Write-Ahead Logging (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging) para garantir tanto a durabilidade quanto a portabilidade dos seus dados, mantendo os mais altos padrões de privacidade e segurança.
Aqui está uma visão de como implementamos o SQLite com [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) como o cifrador para criptografia resistente a computadores quânticos:

```javascript
// Inicialize o banco de dados com better-sqlite3-multiple-ciphers
const Database = require('better-sqlite3-multiple-ciphers');

// Configure a criptografia com o cifrador ChaCha20-Poly1305
db.pragma(`key="${decrypt(session.user.password)}"`);

// Ative o Write-Ahead Logging para durabilidade e desempenho
db.pragma('journal_mode=WAL');

// Sobrescreva o conteúdo deletado com zeros para privacidade
db.pragma('secure_delete=ON');

// Ative o auto vacuum para gerenciamento eficiente de armazenamento
db.pragma('auto_vacuum=FULL');

// Defina o tempo limite de espera para lidar com acesso concorrente
db.pragma(`busy_timeout=${config.busyTimeout}`);

// Otimize a sincronização para confiabilidade
db.pragma('synchronous=NORMAL');

// Ative as restrições de chave estrangeira para integridade dos dados
db.pragma('foreign_keys=ON');

// Defina a codificação UTF-8 para suporte a caracteres internacionais
db.pragma(`encoding='UTF-8'`);

// Otimize o desempenho do banco de dados
db.pragma('optimize=0x10002;');

// Use o disco para armazenamento temporário em vez da memória
db.pragma('temp_store=1;');
```

Esta implementação garante que seus dados não sejam apenas seguros, mas também portáteis. Você pode levar seu e-mail a qualquer momento exportando nos formatos [MBOX](https://en.wikipedia.org/wiki/Email#Storage), [EML](https://en.wikipedia.org/wiki/Email#Storage) ou SQLite. E quando quiser deletar seus dados, eles desaparecem de verdade – simplesmente deletamos os arquivos do armazenamento em disco em vez de executar comandos SQL DELETE ROW, que podem deixar rastros no banco de dados.

O aspecto de criptografia quântica da nossa implementação usa ChaCha20-Poly1305 como cifrador quando inicializamos o banco de dados, proporcionando forte proteção contra ameaças atuais e futuras à privacidade dos seus dados.


## Fila Inteligente e Mecanismo de Retentativa: Garantindo a Entrega de E-mails {#smart-queue-and-retry-mechanism-ensuring-email-delivery}

Em vez de focar apenas no tratamento de cabeçalhos, implementamos uma fila inteligente sofisticada e um mecanismo de retentativa com nosso método `getBounceInfo`. Este sistema garante que seus e-mails tenham a melhor chance de serem entregues, mesmo quando surgem problemas temporários.

```javascript
function getBounceInfo(err) {
  // Inicialize as informações de bounce com valores padrão
  const bounceInfo = {
    action: err.responseCode >= 500 ? 'reject' : 'defer',
    category: err.category || 'other',
    message: err.message,
    code: err.responseCode || err.code
  };

  // Analise a resposta do erro para determinar a ação apropriada
  const response = err.response || err.message || '';

  // Determine se o problema é temporário ou permanente
  if (response.includes('temporarily deferred') ||
      response.includes('try again later')) {
    bounceInfo.action = 'defer';
  }

  // Categorize o motivo do bounce para tratamento adequado
  if (response.includes('mailbox full')) {
    bounceInfo.category = 'full';
    bounceInfo.action = 'defer';
  } else if (response.includes('user unknown')) {
    bounceInfo.category = 'unknown';
  }

  return bounceInfo;
}
```

> \[!NOTE]
> Este é um trecho do método `getBounceInfo` e não a implementação extensa real. Para o código completo, você pode revisá-lo no [GitHub](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/get-bounce-info.js).

Repetimos a tentativa de entrega de e-mails por 5 dias, semelhante aos padrões da indústria como o [Postfix](https://en.wikipedia.org/wiki/Postfix_\(software\)), dando tempo para que problemas temporários se resolvam. Essa abordagem melhora significativamente as taxas de entrega enquanto mantém a privacidade.

De forma semelhante, também redigimos o conteúdo das mensagens de e-mails SMTP enviados após a entrega bem-sucedida. Isso é configurado em nosso sistema de armazenamento com um período padrão de retenção de 30 dias, que você pode ajustar nas Configurações Avançadas do seu domínio. Após esse período, o conteúdo do e-mail é automaticamente redigido e purgado, permanecendo apenas uma mensagem substituta:

```txt
Esta mensagem foi enviada com sucesso. Ela foi redigida e purgada para sua segurança e privacidade. Se você desejar aumentar o tempo de retenção das suas mensagens, por favor, acesse a página de Configurações Avançadas do seu domínio.
```
Esta abordagem garante que seus e-mails enviados não fiquem armazenados indefinidamente, reduzindo o risco de vazamentos de dados ou acesso não autorizado às suas comunicações.


## Recursos Ilimitados com Limitação de Taxa Inteligente {#unlimited-resources-with-intelligent-rate-limiting}

Embora o Forward Email ofereça domínios e aliases ilimitados, implementamos uma limitação de taxa inteligente para proteger nosso sistema contra abusos e garantir o uso justo para todos os usuários. Por exemplo, clientes não empresariais podem criar até 50+ aliases por dia, o que evita que nosso banco de dados seja inundado com spam e permite que nossos recursos de proteção e combate a abusos em tempo real funcionem efetivamente.

```javascript
// Rate limiter implementation
const rateLimiter = new RateLimiter({
  // Configuration settings
});

// Check rate limits before processing
const limit = await rateLimiter.get({
  key: `domain:${domain.id}`,
  duration: ms('1d')
});

// Apply appropriate action based on limit status
if (limit.remaining <= 0) {
  // Handle rate limit exceeded
}
```

Essa abordagem equilibrada oferece a você a flexibilidade de criar quantos endereços de e-mail precisar para uma gestão abrangente de privacidade, mantendo a integridade e o desempenho do nosso serviço para todos os usuários.


## Criptografia em Sandbox para Segurança Aprimorada {#sandboxed-encryption-for-enhanced-security}

Nossa abordagem única de criptografia em sandbox oferece uma vantagem crítica de segurança que muitos usuários ignoram ao escolher um serviço de e-mail. Vamos explorar por que isolar dados, especialmente e-mails, é tão importante.

Serviços como Gmail e Proton provavelmente usam [bancos de dados relacionais](https://en.wikipedia.org/wiki/Relational_database) compartilhados, o que cria uma vulnerabilidade fundamental de segurança. Em um ambiente de banco de dados compartilhado, se alguém obtiver acesso aos dados de um usuário, potencialmente terá um caminho para acessar os dados de outros usuários também. Isso ocorre porque todos os dados dos usuários residem nas mesmas tabelas do banco de dados, separados apenas por IDs de usuário ou identificadores similares.

O Forward Email adota uma abordagem fundamentalmente diferente com nossa criptografia em sandbox:

1. **Isolamento completo**: Os dados de cada usuário são armazenados em seu próprio arquivo de banco de dados SQLite criptografado, completamente isolado dos demais usuários
2. **Chaves de criptografia independentes**: Cada banco de dados é criptografado com sua própria chave única derivada da senha do usuário
3. **Sem armazenamento compartilhado**: Diferente dos bancos de dados relacionais onde todos os e-mails dos usuários podem estar em uma única tabela "emails", nossa abordagem garante que não haja mistura de dados
4. **Defesa em profundidade**: Mesmo que o banco de dados de um usuário seja comprometido de alguma forma, isso não dará acesso aos dados de nenhum outro usuário

Essa abordagem em sandbox é semelhante a ter seu e-mail em um cofre físico separado, em vez de em um depósito compartilhado com divisórias internas. É uma diferença arquitetônica fundamental que aprimora significativamente sua privacidade e segurança.


## Processamento de E-mail em Memória: Sem Armazenamento em Disco para Máxima Privacidade {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

Para nosso serviço de encaminhamento de e-mails, processamos os e-mails inteiramente na RAM e nunca os gravamos em armazenamento de disco ou bancos de dados. Essa abordagem oferece proteção incomparável contra vigilância de e-mails e coleta de metadados.

Aqui está uma visão simplificada de como nosso processamento de e-mails funciona:

```javascript
async function onData(stream, _session, fn) {
  // Store clone of session since it gets modified/destroyed
  const session = JSON.parse(safeStringify(_session));

  try {
    // Process the email stream in memory
    const messageSplitter = new MessageSplitter({
      maxBytes: MAX_BYTES
    });
    stream.pipe(messageSplitter);
    const body = await getStream.buffer(messageSplitter);

    const { headers } = messageSplitter;

    // Update session object with useful debug info for error logs
    await updateSession.call(this, body, headers, session);

    // Process the email without storing to disk
    // [Processing code omitted for brevity]

    // Return success without persisting email data
    fn();
  } catch (err) {
    // Handle errors without storing sensitive information
    fn(err);
  }
}
```
Esta abordagem significa que mesmo que nossos servidores fossem comprometidos, não haveria dados históricos de e-mails para os invasores acessarem. Seus e-mails simplesmente passam pelo nosso sistema e são imediatamente encaminhados para o destino sem deixar rastros. Essa abordagem de encaminhamento de e-mails sem registro é fundamental para proteger suas comunicações contra vigilância.


## Criptografia de Ponta a Ponta com OpenPGP para Privacidade Completa {#end-to-end-encryption-with-openpgp-for-complete-privacy}

Para usuários que exigem o mais alto nível de proteção de privacidade contra vigilância de e-mails, oferecemos suporte ao [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) para criptografia de ponta a ponta. Diferente de muitos provedores de e-mail que exigem pontes ou aplicativos proprietários, nossa implementação funciona com clientes de e-mail padrão, tornando a comunicação segura acessível a todos.

Veja como implementamos a criptografia OpenPGP:

```javascript
async function encryptMessage(pubKeyArmored, raw, isArmored = true) {
  // [Initial validation code omitted for brevity]

  // Read the public key
  const pubKey = isArmored
    ? await openpgp.readKey({
        armoredKey: tools.prepareArmoredPubKey(pubKeyArmored),
        config: { tolerant: true }
      })
    : pubKeyArmored;

  if (!pubKey) throw new TypeError('Public key does not exist');

  // Perform the actual encryption using OpenPGP
  const ciphertext = await openpgp.encrypt({
    message: await openpgp.createMessage({
      binary: Buffer.concat([Buffer.from(bodyHeaders + '\r\n\r\n'), body])
    }),
    encryptionKeys: pubKey,
    format: 'armored',
    config: { minRSABits: 1024 }
  });

  // Format the encrypted message as a proper MIME message
  // [MIME formatting code omitted for brevity]

  return Buffer.concat([headers, breaker, Buffer.from(text)]);
}
```

Esta implementação garante que seus e-mails sejam criptografados antes de saírem do seu dispositivo e só possam ser descriptografados pelo destinatário pretendido, mantendo suas comunicações privadas até mesmo para nós. Isso é essencial para proteger comunicações sensíveis contra acesso não autorizado e vigilância.


## Proteção de Conteúdo em Múltiplas Camadas para Segurança Abrangente {#multi-layered-content-protection-for-comprehensive-security}

O Forward Email oferece múltiplas camadas de proteção de conteúdo que são ativadas por padrão para fornecer segurança abrangente contra várias ameaças:

1. **Proteção contra conteúdo adulto** - Filtra conteúdo inapropriado sem comprometer a privacidade
2. **Proteção contra [Phishing](https://en.wikipedia.org/wiki/Phishing)** - Bloqueia tentativas de roubo de informações preservando o anonimato
3. **Proteção contra executáveis** - Impede anexos potencialmente nocivos sem escanear o conteúdo
4. **Proteção contra [Vírus](https://en.wikipedia.org/wiki/Computer_virus)** - Escaneia malware usando técnicas que preservam a privacidade

Diferente de muitos provedores que tornam esses recursos opt-in, nós os tornamos opt-out, garantindo que todos os usuários se beneficiem dessas proteções por padrão. Essa abordagem reflete nosso compromisso tanto com a privacidade quanto com a segurança, proporcionando um equilíbrio que muitos serviços de e-mail não conseguem alcançar.


## Como Diferimos de Outros Serviços de E-mail: A Vantagem Técnica da Privacidade {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

Ao comparar o Forward Email com outros serviços de e-mail, várias diferenças técnicas importantes destacam nossa abordagem centrada na privacidade:

### Transparência Open Source para Privacidade Verificável {#open-source-transparency-for-verifiable-privacy}

Enquanto muitos provedores de e-mail afirmam ser open source, frequentemente mantêm seu código backend fechado. O Forward Email é 100% [open source](https://en.wikipedia.org/wiki/Open_source), incluindo código frontend e backend. Essa transparência permite auditoria de segurança independente de todos os componentes, garantindo que nossas alegações de privacidade possam ser verificadas por qualquer pessoa.

### Sem Aprisionamento de Fornecedor para Privacidade Sem Compromissos {#no-vendor-lock-in-for-privacy-without-compromise}

Muitos provedores de e-mail focados em privacidade exigem que você use seus aplicativos ou pontes proprietárias. O Forward Email funciona com qualquer cliente de e-mail padrão através dos protocolos [IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol), [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) e [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol), dando a você a liberdade de escolher seu software de e-mail preferido sem comprometer a privacidade.
### Dados Isolados para Verdadeira Isolamento {#sandboxed-data-for-true-isolation}

Ao contrário dos serviços que usam bancos de dados compartilhados onde os dados de todos os usuários são misturados, nossa abordagem isolada garante que os dados de cada usuário estejam completamente isolados. Essa diferença arquitetônica fundamental oferece garantias de privacidade significativamente mais fortes do que a maioria dos serviços de email oferece.

### Portabilidade e Controle de Dados {#data-portability-and-control}

Acreditamos que seus dados pertencem a você, por isso facilitamos a exportação dos seus emails em formatos padrão (MBOX, EML, SQLite) e a exclusão verdadeira dos seus dados quando desejar. Esse nível de controle é raro entre os provedores de email, mas essencial para a verdadeira privacidade.


## Os Desafios Técnicos do Encaminhamento de Email com Prioridade à Privacidade {#the-technical-challenges-of-privacy-first-email-forwarding}

Construir um serviço de email com prioridade à privacidade traz desafios técnicos significativos. Aqui estão alguns dos obstáculos que superamos:

### Gerenciamento de Memória para Processamento de Email Sem Registro {#memory-management-for-no-logging-email-processing}

Processar emails na memória sem armazenamento em disco requer um gerenciamento cuidadoso da memória para lidar eficientemente com altos volumes de tráfego de email. Implementamos técnicas avançadas de otimização de memória para garantir desempenho confiável sem comprometer nossa política de não armazenamento, um componente crítico da nossa estratégia de proteção de privacidade.

### Detecção de Spam Sem Análise de Conteúdo para Filtragem que Preserva a Privacidade {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

A maioria dos sistemas de [spam](https://en.wikipedia.org/wiki/Email_spam) depende da análise do conteúdo do email, o que conflita com nossos princípios de privacidade. Desenvolvemos técnicas para identificar padrões de spam sem ler o conteúdo dos seus emails, equilibrando privacidade e usabilidade que preserva a confidencialidade das suas comunicações.

### Manutenção da Compatibilidade com Design Prioritário à Privacidade {#maintaining-compatibility-with-privacy-first-design}

Garantir compatibilidade com todos os clientes de email enquanto implementamos recursos avançados de privacidade exigiu soluções criativas de engenharia. Nossa equipe trabalhou incansavelmente para tornar a privacidade transparente, para que você não precise escolher entre conveniência e segurança ao proteger suas comunicações por email.


## Melhores Práticas de Privacidade para Usuários do Forward Email {#privacy-best-practices-for-forward-email-users}

Para maximizar sua proteção contra vigilância de email e aumentar sua privacidade ao usar o Forward Email, recomendamos as seguintes melhores práticas:

1. **Use aliases únicos para diferentes serviços** - Crie um alias de email diferente para cada serviço que você se inscrever para evitar rastreamento entre serviços
2. **Ative a criptografia OpenPGP** - Para comunicações sensíveis, use criptografia de ponta a ponta para garantir privacidade completa
3. **Roteie regularmente seus aliases de email** - Atualize periodicamente os aliases para serviços importantes para minimizar a coleta de dados a longo prazo
4. **Use senhas fortes e únicas** - Proteja sua conta do Forward Email com uma senha forte para evitar acessos não autorizados
5. **Implemente a anonimização de [endereço IP](https://en.wikipedia.org/wiki/IP_address)** - Considere usar uma [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) em conjunto com o Forward Email para anonimato completo


## Conclusão: O Futuro do Encaminhamento de Email Privado {#conclusion-the-future-of-private-email-forwarding}

No Forward Email, acreditamos que privacidade não é apenas um recurso—é um direito fundamental. Nossas implementações técnicas refletem essa crença, oferecendo encaminhamento de email que respeita sua privacidade em todos os níveis e protege você contra vigilância de email e coleta de metadados.

À medida que continuamos a desenvolver e melhorar nosso serviço, nosso compromisso com a privacidade permanece inabalável. Estamos constantemente pesquisando novos métodos de criptografia, explorando proteções adicionais de privacidade e refinando nossa base de código para proporcionar a experiência de email mais segura possível.

Ao escolher o Forward Email, você não está apenas selecionando um serviço de email—você está apoiando uma visão da internet onde a privacidade é o padrão, não a exceção. Junte-se a nós na construção de um futuro digital mais privado, um email de cada vez.
<!-- *Keywords: private email forwarding, email privacy protection, secure email service, open-source email, quantum-safe encryption, OpenPGP email, in-memory email processing, no-log email service, email metadata protection, email header privacy, end-to-end encrypted email, privacy-first email, anonymous email forwarding, email security best practices, email content protection, phishing protection, email virus scanning, privacy-focused email provider, secure email headers, email privacy implementation, protection from email surveillance, no-logging email forwarding, prevent email metadata leakage, email privacy techniques, IP address anonymization for email, private email aliases, email forwarding security, email privacy from advertisers, quantum-resistant email encryption, email privacy without compromise, SQLite email storage, sandboxed email encryption, data portability for email* -->

