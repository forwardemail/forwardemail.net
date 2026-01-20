# Como o Forward Email protege sua privacidade, domínio e segurança: uma análise técnica aprofundada {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<img loading="lazy" src="/img/articles/email-forwarding.webp" alt="Best email forwarding service comparison" class="rounded-lg" />

## Índice {#table-of-contents}

* [Prefácio](#foreword)
* [A filosofia de privacidade do Forward Email](#the-forward-email-privacy-philosophy)
* [Implementação do SQLite: Durabilidade e Portabilidade para Seus Dados](#sqlite-implementation-durability-and-portability-for-your-data)
* [Fila inteligente e mecanismo de repetição: garantindo a entrega de e-mails](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [Recursos ilimitados com limitação de taxa inteligente](#unlimited-resources-with-intelligent-rate-limiting)
* [Criptografia em sandbox para segurança aprimorada](#sandboxed-encryption-for-enhanced-security)
* [Processamento de e-mail na memória: sem armazenamento em disco para privacidade máxima](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [Criptografia de ponta a ponta com OpenPGP para privacidade completa](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [Proteção de conteúdo em várias camadas para segurança abrangente](#multi-layered-content-protection-for-comprehensive-security)
* [Como nos diferenciamos de outros serviços de e-mail: a vantagem da privacidade técnica](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [Transparência de código aberto para privacidade verificável](#open-source-transparency-for-verifiable-privacy)
  * [Sem bloqueio de fornecedor para privacidade sem concessões](#no-vendor-lock-in-for-privacy-without-compromise)
  * [Dados em sandbox para isolamento real](#sandboxed-data-for-true-isolation)
  * [Portabilidade e controle de dados](#data-portability-and-control)
* [Os desafios técnicos do encaminhamento de e-mail com foco na privacidade](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [Gerenciamento de memória para processamento de e-mail sem registro](#memory-management-for-no-logging-email-processing)
  * [Detecção de spam sem análise de conteúdo para filtragem que preserva a privacidade](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [Mantendo a compatibilidade com o design que prioriza a privacidade](#maintaining-compatibility-with-privacy-first-design)
* [Melhores práticas de privacidade para usuários de encaminhamento de e-mail](#privacy-best-practices-for-forward-email-users)
* [Conclusão: O futuro do encaminhamento de e-mail privado](#conclusion-the-future-of-private-email-forwarding)

## Prefácio {#foreword}

No cenário digital atual, a privacidade do e-mail tornou-se mais crítica do que nunca. Com violações de dados, preocupações com vigilância e publicidade direcionada com base no conteúdo do e-mail, os usuários buscam cada vez mais soluções que priorizem sua privacidade. Na Forward Email, construímos nosso serviço do zero, tendo a privacidade como base da nossa arquitetura. Este post explora as implementações técnicas que tornam nosso serviço uma das soluções de encaminhamento de e-mail mais focadas em privacidade disponíveis.

## A filosofia de privacidade do Forward Email {#the-forward-email-privacy-philosophy}

Antes de nos aprofundarmos nos detalhes técnicos, é importante entender nossa filosofia fundamental de privacidade: **seus e-mails pertencem a você e somente a você**. Esse princípio norteia todas as decisões técnicas que tomamos, desde como lidamos com o encaminhamento de e-mails até como implementamos a criptografia.

Ao contrário de muitos provedores de e-mail que analisam suas mensagens para fins publicitários ou as armazenam indefinidamente em seus servidores, o Forward Email opera com uma abordagem radicalmente diferente:

1. **Somente processamento na memória** - Não armazenamos seus e-mails encaminhados em disco
2. **Sem armazenamento de metadados** - Não mantemos registros de quem está enviando e-mails para quem
3. **100% código aberto** - Toda a nossa base de código é transparente e auditável
4. **Criptografia de ponta a ponta** - Oferecemos suporte ao OpenPGP para comunicações verdadeiramente privadas

## Implementação do SQLite: Durabilidade e Portabilidade para Seus Dados {#sqlite-implementation-durability-and-portability-for-your-data}

Uma das vantagens de privacidade mais significativas do Forward Email é a nossa implementação [SQLite](https://en.wikipedia.org/wiki/SQLite), cuidadosamente projetada. Ajustamos o SQLite com configurações PRAGMA específicas e [Registro de Gravação Antecipada (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging) para garantir a durabilidade e a portabilidade dos seus dados, mantendo os mais altos padrões de privacidade e segurança.

Veja como implementamos o SQLite com [ChaCha20-Poli1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) como a cifra para criptografia resistente a quantum:

```javascript
// Initialize the database with better-sqlite3-multiple-ciphers
const Database = require('better-sqlite3-multiple-ciphers');

// Set up encryption with ChaCha20-Poly1305 cipher
db.pragma(`key="${decrypt(session.user.password)}"`);

// Enable Write-Ahead Logging for durability and performance
db.pragma('journal_mode=WAL');

// Overwrite deleted content with zeros for privacy
db.pragma('secure_delete=ON');

// Enable auto vacuum for efficient storage management
db.pragma('auto_vacuum=FULL');

// Set busy timeout for handling concurrent access
db.pragma(`busy_timeout=${config.busyTimeout}`);

// Optimize synchronization for reliability
db.pragma('synchronous=NORMAL');

// Enable foreign key constraints for data integrity
db.pragma('foreign_keys=ON');

// Set UTF-8 encoding for international character support
db.pragma(`encoding='UTF-8'`);

// Optimize database performance
db.pragma('optimize=0x10002;');

// Use disk for temporary storage instead of memory
db.pragma('temp_store=1;');
```

Esta implementação garante que seus dados não estejam apenas seguros, mas também portáteis. Você pode acessar seu e-mail a qualquer momento exportando nos formatos [MBOX](https://en.wikipedia.org/wiki/Email#Storage), [EML](https://en.wikipedia.org/wiki/Email#Storage) ou SQLite. E quando você quiser excluir seus dados, eles realmente desaparecerão – simplesmente excluímos os arquivos do armazenamento em disco em vez de executar comandos SQL DELETE ROW, que podem deixar rastros no banco de dados.

O aspecto de criptografia quântica da nossa implementação usa ChaCha20-Poly1305 como cifra quando inicializamos o banco de dados, fornecendo forte proteção contra ameaças atuais e futuras à privacidade dos seus dados.

## Mecanismo de fila inteligente e repetição: garantindo a entrega de e-mails {#smart-queue-and-retry-mechanism-ensuring-email-delivery}

Em vez de focar apenas no tratamento de cabeçalhos, implementamos um sofisticado mecanismo inteligente de fila e repetição com nosso método `getBounceInfo`. Este sistema garante que seus e-mails tenham a melhor chance de serem entregues, mesmo em caso de problemas temporários.

```javascript
function getBounceInfo(err) {
  // Initialize bounce info with default values
  const bounceInfo = {
    action: err.responseCode >= 500 ? 'reject' : 'defer',
    category: err.category || 'other',
    message: err.message,
    code: err.responseCode || err.code
  };

  // Analyze error response to determine appropriate action
  const response = err.response || err.message || '';

  // Determine if the issue is temporary or permanent
  if (response.includes('temporarily deferred') ||
      response.includes('try again later')) {
    bounceInfo.action = 'defer';
  }

  // Categorize the bounce reason for appropriate handling
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
> Este é um trecho do método `getBounceInfo` e não a implementação completa. Para o código completo, você pode revisá-lo em [GitHub](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/get-bounce-info.js).

Tentamos entregar a correspondência novamente por 5 dias, semelhante aos padrões do setor (como [Sufixo](https://en.wikipedia.org/wiki/Postfix_\(software\)), dando tempo para que problemas temporários se resolvam. Essa abordagem melhora significativamente as taxas de entrega, preservando a privacidade.

Da mesma forma, também editamos o conteúdo das mensagens de e-mails SMTP enviados após a entrega bem-sucedida. Isso é configurado em nosso sistema de armazenamento com um período de retenção padrão de 30 dias, que você pode ajustar nas Configurações Avançadas do seu domínio. Após esse período, o conteúdo do e-mail é editado e removido automaticamente, restando apenas uma mensagem de espaço reservado:

```txt
This message was successfully sent. It has been redacted and purged for your security and privacy. If you would like to increase your message retention time, please go to the Advanced Settings page for your domain.
```

Essa abordagem garante que seus e-mails enviados não permaneçam armazenados indefinidamente, reduzindo o risco de violações de dados ou acesso não autorizado às suas comunicações.

## Recursos ilimitados com limitação de taxa inteligente {#unlimited-resources-with-intelligent-rate-limiting}

Embora o Forward Email ofereça domínios e aliases ilimitados, implementamos um sistema inteligente de limitação de taxas para proteger nosso sistema contra abusos e garantir o uso justo para todos os usuários. Por exemplo, clientes não empresariais podem criar até 50 aliases por dia, o que evita que nosso banco de dados seja inundado por spam e inundações, além de permitir que nossos recursos de proteção e combate a abusos em tempo real funcionem de forma eficaz.

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

Essa abordagem equilibrada oferece a flexibilidade necessária para criar quantos endereços de e-mail forem necessários para um gerenciamento abrangente de privacidade, mantendo ao mesmo tempo a integridade e o desempenho do nosso serviço para todos os usuários.

## Criptografia em sandbox para segurança aprimorada {#sandboxed-encryption-for-enhanced-security}

Nossa abordagem exclusiva de criptografia em sandbox oferece uma vantagem de segurança crucial que muitos usuários ignoram ao escolher um serviço de e-mail. Vamos explorar por que o sandbox de dados, especialmente de e-mail, é tão importante.

Serviços como Gmail e Proton provavelmente usam [bancos de dados relacionais](https://en.wikipedia.org/wiki/Relational_database) compartilhado, o que cria uma vulnerabilidade de segurança fundamental. Em um ambiente de banco de dados compartilhado, se alguém obtém acesso aos dados de um usuário, potencialmente tem um caminho para acessar também os dados de outros usuários. Isso ocorre porque todos os dados do usuário residem nas mesmas tabelas do banco de dados, separados apenas por IDs de usuário ou identificadores semelhantes.

O Forward Email adota uma abordagem fundamentalmente diferente com nossa criptografia em sandbox:

1. **Isolamento completo**: Os dados de cada usuário são armazenados em seu próprio arquivo de banco de dados SQLite criptografado, completamente isolado dos demais usuários.
2. **Chaves de criptografia independentes**: Cada banco de dados é criptografado com sua própria chave exclusiva, derivada da senha do usuário.
3. **Sem armazenamento compartilhado**: Ao contrário dos bancos de dados relacionais, onde todos os e-mails dos usuários podem estar em uma única tabela de "e-mails", nossa abordagem garante que os dados não sejam misturados.
4. **Defesa em profundidade**: Mesmo que o banco de dados de um usuário fosse comprometido de alguma forma, ele não forneceria acesso aos dados de nenhum outro usuário.

Essa abordagem de sandbox é semelhante a ter seu e-mail em um cofre físico separado, em vez de em um local de armazenamento compartilhado com divisórias internas. É uma diferença arquitetônica fundamental que aumenta significativamente sua privacidade e segurança.

## Processamento de e-mail na memória: sem armazenamento em disco para privacidade máxima {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

Em nosso serviço de encaminhamento de e-mails, processamos e-mails inteiramente na RAM e nunca os gravamos em disco ou bancos de dados. Essa abordagem oferece proteção incomparável contra vigilância de e-mails e coleta de metadados.

Veja aqui uma visão simplificada de como funciona nosso processamento de e-mail:

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

Essa abordagem significa que, mesmo que nossos servidores fossem comprometidos, não haveria dados históricos de e-mail para que invasores pudessem acessar. Seus e-mails simplesmente passam pelo nosso sistema e são imediatamente encaminhados ao destino, sem deixar rastros. Essa abordagem de encaminhamento de e-mails sem registro é fundamental para proteger suas comunicações contra vigilância.

## Criptografia de ponta a ponta com OpenPGP para privacidade completa {#end-to-end-encryption-with-openpgp-for-complete-privacy}

Para usuários que exigem o mais alto nível de proteção de privacidade contra a vigilância de e-mails, oferecemos suporte a [OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) para criptografia de ponta a ponta. Ao contrário de muitos provedores de e-mail que exigem pontes ou aplicativos proprietários, nossa implementação funciona com clientes de e-mail padrão, tornando a comunicação segura acessível a todos.

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

Esta implementação garante que seus e-mails sejam criptografados antes de saírem do seu dispositivo e só possam ser descriptografados pelo destinatário pretendido, mantendo suas comunicações privadas, mesmo para nós. Isso é essencial para proteger comunicações confidenciais contra acesso não autorizado e vigilância.

## Proteção de conteúdo em várias camadas para segurança abrangente {#multi-layered-content-protection-for-comprehensive-security}

O Forward Email oferece várias camadas de proteção de conteúdo que são ativadas por padrão para fornecer segurança abrangente contra várias ameaças:

1. **Proteção de conteúdo adulto** - Filtra conteúdo impróprio sem comprometer a privacidade
2. **Proteção [Phishing](https://en.wikipedia.org/wiki/Phishing)** - Bloqueia tentativas de roubo de suas informações, preservando o anonimato
3. **Proteção executável** - Impede anexos potencialmente prejudiciais sem verificar o conteúdo
4. **Proteção [Vírus](https://en.wikipedia.org/wiki/Computer_virus)** - Verifica malware usando técnicas que preservam a privacidade

Ao contrário de muitos provedores que tornam esses recursos opcionais, nós os tornamos opcionais, garantindo que todos os usuários se beneficiem dessas proteções por padrão. Essa abordagem reflete nosso compromisso com a privacidade e a segurança, proporcionando um equilíbrio que muitos serviços de e-mail não conseguem alcançar.

## Como nos diferenciamos de outros serviços de e-mail: a vantagem técnica da privacidade {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

Ao comparar o Forward Email com outros serviços de e-mail, diversas diferenças técnicas importantes destacam nossa abordagem que prioriza a privacidade:

### Transparência de código aberto para privacidade verificável {#open-source-transparency-for-verifiable-privacy}

Embora muitos provedores de e-mail afirmem ser de código aberto, eles frequentemente mantêm seu código de back-end fechado. O Forward Email é 100% [código aberto](https://en.wikipedia.org/wiki/Open_source), incluindo o código de front-end e back-end. Essa transparência permite auditoria de segurança independente de todos os componentes, garantindo que nossas declarações de privacidade possam ser verificadas por qualquer pessoa.

### Sem bloqueio de fornecedor para privacidade sem comprometimento {#no-vendor-lock-in-for-privacy-without-compromise}

Muitos provedores de e-mail com foco em privacidade exigem que você use seus aplicativos ou pontes proprietários. O Forward Email funciona com qualquer cliente de e-mail padrão através dos protocolos [IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol), [POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol) e [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol), dando a você a liberdade de escolher seu software de e-mail preferido sem comprometer a privacidade.

### Dados em sandbox para isolamento verdadeiro {#sandboxed-data-for-true-isolation}

Ao contrário de serviços que utilizam bancos de dados compartilhados, onde os dados de todos os usuários são combinados, nossa abordagem de sandbox garante que os dados de cada usuário sejam completamente isolados. Essa diferença arquitetônica fundamental oferece garantias de privacidade significativamente mais robustas do que as oferecidas pela maioria dos serviços de e-mail.

### Portabilidade e Controle de Dados {#data-portability-and-control}

Acreditamos que seus dados pertencem a você, por isso facilitamos a exportação de seus e-mails em formatos padrão (MBOX, EML, SQLite) e a exclusão de seus dados quando você desejar. Esse nível de controle é raro entre provedores de e-mail, mas essencial para uma privacidade verdadeira.

## Os desafios técnicos do encaminhamento de e-mail com foco na privacidade {#the-technical-challenges-of-privacy-first-email-forwarding}

Construir um serviço de e-mail que prioriza a privacidade traz consigo desafios técnicos significativos. Aqui estão alguns dos obstáculos que superamos:

### Gerenciamento de memória para processamento de e-mail sem registro {#memory-management-for-no-logging-email-processing}

O processamento de e-mails na memória sem armazenamento em disco exige um gerenciamento cuidadoso da memória para lidar com altos volumes de tráfego de e-mail com eficiência. Implementamos técnicas avançadas de otimização de memória para garantir um desempenho confiável sem comprometer nossa política de não armazenamento, um componente essencial da nossa estratégia de proteção de privacidade.

### Detecção de spam sem análise de conteúdo para filtragem de preservação de privacidade {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

A maioria dos sistemas de detecção [spam](https://en.wikipedia.org/wiki/Email_spam) depende da análise do conteúdo de e-mails, o que entra em conflito com nossos princípios de privacidade. Desenvolvemos técnicas para identificar padrões de spam sem ler o conteúdo dos seus e-mails, buscando um equilíbrio entre privacidade e usabilidade que preserva a confidencialidade das suas comunicações.

### Mantendo a compatibilidade com o design que prioriza a privacidade {#maintaining-compatibility-with-privacy-first-design}

Garantir a compatibilidade com todos os clientes de e-mail e, ao mesmo tempo, implementar recursos avançados de privacidade exigiu soluções criativas de engenharia. Nossa equipe trabalhou incansavelmente para tornar a privacidade integrada, para que você não precise escolher entre conveniência e segurança ao proteger suas comunicações por e-mail.

## Práticas recomendadas de privacidade para usuários de encaminhamento de e-mail {#privacy-best-practices-for-forward-email-users}

Para maximizar sua proteção contra vigilância de e-mail e maximizar sua privacidade ao usar o Forward Email, recomendamos as seguintes práticas recomendadas:

1. **Use aliases exclusivos para serviços diferentes** - Crie um alias de e-mail diferente para cada serviço que você assinar para evitar rastreamento entre serviços
2. **Habilite a criptografia OpenPGP** - Para comunicações confidenciais, use criptografia de ponta a ponta para garantir privacidade total
3. **Alterne regularmente seus aliases de e-mail** - Atualize periodicamente os aliases de serviços importantes para minimizar a coleta de dados a longo prazo
4. **Use senhas fortes e exclusivas** - Proteja sua conta do Forward Email com uma senha forte para impedir acesso não autorizado
5. **Implemente a anonimização do [Endereço IP](https://en.wikipedia.org/wiki/IP_address)** - Considere usar um [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) em conjunto com o Forward Email para anonimato total

## Conclusão: O futuro do encaminhamento de e-mail privado {#conclusion-the-future-of-private-email-forwarding}

Na Forward Email, acreditamos que a privacidade não é apenas um recurso — é um direito fundamental. Nossas implementações técnicas refletem essa crença, oferecendo um encaminhamento de e-mails que respeita sua privacidade em todos os níveis e protege você da vigilância de e-mails e da coleta de metadados.

À medida que continuamos a desenvolver e aprimorar nossos serviços, nosso compromisso com a privacidade permanece inabalável. Estamos constantemente pesquisando novos métodos de criptografia, explorando proteções de privacidade adicionais e refinando nossa base de código para fornecer a experiência de e-mail mais segura possível.

Ao escolher o Encaminhamento de E-mail, você não está apenas selecionando um serviço de e-mail — você está apoiando uma visão da internet onde a privacidade é o padrão, não a exceção. Junte-se a nós na construção de um futuro digital mais privado, um e-mail de cada vez.

<!-- *Palavras-chave: encaminhamento de e-mail privado, proteção de privacidade de e-mail, serviço de e-mail seguro, e-mail de código aberto, criptografia quântica segura, e-mail OpenPGP, processamento de e-mail na memória, serviço de e-mail sem registro, proteção de metadados de e-mail, privacidade de cabeçalho de e-mail, e-mail criptografado de ponta a ponta, e-mail com foco em privacidade, encaminhamento de e-mail anônimo, práticas recomendadas de segurança de e-mail, proteção de conteúdo de e-mail, proteção contra phishing, verificação de vírus de e-mail, provedor de e-mail com foco em privacidade, cabeçalhos de e-mail seguros, implementação de privacidade de e-mail, proteção contra vigilância de e-mail, encaminhamento de e-mail sem registro, prevenção de vazamento de metadados de e-mail, técnicas de privacidade de e-mail, anonimização de endereço IP para e-mail, aliases de e-mail privado, segurança de encaminhamento de e-mail, privacidade de e-mail de anunciantes, criptografia de e-mail resistente a quantum, privacidade de e-mail sem comprometimento, armazenamento de e-mail SQLite, criptografia de e-mail em sandbox, portabilidade de dados para e-mail* -->