# E-mail auto-hospedado: Compromisso com o código aberto {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="Self-hosted email solution illustration" class="rounded-lg" />

## Índice {#table-of-contents}

* [Prefácio](#foreword)
* [Por que o e-mail auto-hospedado é importante](#why-self-hosted-email-matters)
  * [O problema com os serviços de e-mail tradicionais](#the-problem-with-traditional-email-services)
  * [A alternativa auto-hospedada](#the-self-hosted-alternative)
* [Nossa implementação auto-hospedada: Visão geral técnica](#our-self-hosted-implementation-technical-overview)
  * [Arquitetura baseada em Docker para simplicidade e portabilidade](#docker-based-architecture-for-simplicity-and-portability)
  * [Instalação do Bash Script: Acessibilidade e Segurança](#bash-script-installation-accessibility-meets-security)
  * [Criptografia Quantum-Safe para privacidade à prova do futuro](#quantum-safe-encryption-for-future-proof-privacy)
  * [Manutenção e atualizações automatizadas](#automated-maintenance-and-updates)
* [O Compromisso com o Código Aberto](#the-open-source-commitment)
* [Auto-hospedado vs. gerenciado: fazendo a escolha certa](#self-hosted-vs-managed-making-the-right-choice)
  * [A realidade da auto-hospedagem de e-mail](#the-reality-of-self-hosting-email)
  * [Quando escolher nosso serviço gerenciado](#when-to-choose-our-managed-service)
* [Introdução ao encaminhamento de e-mail auto-hospedado](#getting-started-with-self-hosted-forward-email)
  * [Requisitos do sistema](#system-requirements)
  * [Etapas de instalação](#installation-steps)
* [O futuro do e-mail auto-hospedado](#the-future-of-self-hosted-email)
* [Conclusão: Liberdade de e-mail para todos](#conclusion-email-freedom-for-everyone)
* [Referências](#references)

## Prefácio {#foreword}

No cenário digital atual, o e-mail continua sendo a espinha dorsal da nossa identidade e comunicação online. No entanto, à medida que as preocupações com a privacidade aumentam, muitos usuários se deparam com uma escolha difícil: conveniência em detrimento da privacidade ou privacidade em detrimento da conveniência. Na Forward Email, sempre acreditamos que você não precisa escolher entre as duas.

Hoje, temos o prazer de anunciar um marco significativo em nossa jornada: o lançamento da nossa solução de e-mail auto-hospedada. Este recurso representa nosso mais profundo compromisso com os princípios de código aberto, design focado na privacidade e empoderamento do usuário. Com nossa opção auto-hospedada, colocamos todo o poder e controle da sua comunicação por e-mail diretamente em suas mãos.

Esta postagem do blog explora a filosofia por trás da nossa solução auto-hospedada, sua implementação técnica e por que ela é importante para usuários que priorizam privacidade e propriedade em suas comunicações digitais.

## Por que o e-mail auto-hospedado é importante {#why-self-hosted-email-matters}

Nossa solução de e-mail auto-hospedada é a expressão mais clara da nossa crença de que privacidade verdadeira significa controle, e o controle começa com código aberto. Para usuários que exigem propriedade total sobre suas comunicações digitais, a auto-hospedagem não é mais uma ideia marginal — é um direito essencial. Temos orgulho de apoiar essa crença com uma plataforma totalmente aberta e verificável, que você pode executar nos seus próprios termos.

### O problema com os serviços de e-mail tradicionais {#the-problem-with-traditional-email-services}

Os serviços de e-mail tradicionais apresentam vários desafios fundamentais para usuários preocupados com a privacidade:

1. **Requisitos de Confiança**: Você deve confiar que o provedor não acessará, analisará ou compartilhará seus dados
2. **Controle Centralizado**: Seu acesso pode ser revogado a qualquer momento e por qualquer motivo
3. **Vulnerabilidade de Vigilância**: Serviços centralizados são os principais alvos de vigilância
4. **Transparência Limitada**: A maioria dos serviços utiliza software proprietário e de código fechado
5. **Dependência do Fornecedor**: Migrar desses serviços pode ser difícil ou impossível

Mesmo provedores de e-mail "focados em privacidade" frequentemente falham ao tornarem seus aplicativos front-end de código aberto, enquanto mantêm seus sistemas back-end proprietários e fechados. Isso cria uma lacuna de confiança significativa — você é solicitado a acreditar nas promessas de privacidade deles sem a possibilidade de verificá-las.

### A alternativa auto-hospedada {#the-self-hosted-alternative}

A auto-hospedagem do seu e-mail oferece uma abordagem fundamentalmente diferente:

1. **Controle Total**: Você possui e controla toda a infraestrutura de e-mail
2. **Privacidade Verificável**: Todo o sistema é transparente e auditável
3. **Sem Confiança**: Você não precisa confiar suas comunicações a terceiros
4. **Liberdade de Personalização**: Adapte o sistema às suas necessidades específicas
5. **Resiliência**: Seu serviço continua independentemente das decisões da empresa

Como disse um usuário: "Hospedar meu próprio e-mail é o equivalente digital de cultivar minha própria comida. Dá mais trabalho, mas eu sei exatamente o que tem nele."

## Nossa implementação auto-hospedada: Visão geral técnica {#our-self-hosted-implementation-technical-overview}

Nossa solução de e-mail auto-hospedada é construída com base nos mesmos princípios de privacidade que norteiam todos os nossos produtos. Vamos explorar a implementação técnica que torna isso possível.

### Arquitetura baseada em Docker para simplicidade e portabilidade {#docker-based-architecture-for-simplicity-and-portability}

Empacotamos toda a nossa infraestrutura de e-mail usando o Docker, facilitando a implantação em praticamente qualquer sistema Linux. Essa abordagem em contêineres oferece vários benefícios importantes:

1. **Implantação simplificada**: Um único comando configura toda a infraestrutura
2. **Ambiente consistente**: Elimina problemas de "funciona na minha máquina"
3. **Componentes isolados**: Cada serviço é executado em seu próprio contêiner para segurança
4. **Atualizações fáceis**: Comandos simples para atualizar toda a pilha
5. **Dependências mínimas**: Requer apenas Docker e Docker Compose

A arquitetura inclui contêineres para:

* Interface web para administração
* Servidor SMTP para e-mails enviados
* Servidores IMAP/POP3 para recuperação de e-mails
* Servidor CalDAV para calendários
* Servidor CardDAV para contatos
* Banco de dados para armazenamento de configuração
* Redis para cache e desempenho
* SQLite para armazenamento seguro e criptografado de caixas de correio

> \[!NOTE]
> Não deixe de conferir nosso [guia do desenvolvedor auto-hospedado](https://forwardemail.net/self-hosted)

Instalação do script Bash ###: Acessibilidade e segurança em conjunto {#bash-script-installation-accessibility-meets-security}

Projetamos o processo de instalação para ser o mais simples possível, mantendo as melhores práticas de segurança:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Este único comando:

1. Verifica os requisitos do sistema
2. Orienta você durante a configuração
3. Configura registros DNS
4. Configura certificados TLS
5. Implanta os contêineres Docker
6. Executa o reforço inicial de segurança

Para aqueles preocupados em enviar scripts para o bash (como deveriam estar!), recomendamos revisar o script antes da execução. Ele é totalmente de código aberto e está disponível para inspeção.

### Criptografia Quantum-Safe para Privacidade à Prova do Futuro {#quantum-safe-encryption-for-future-proof-privacy}

Assim como nosso serviço hospedado, nossa solução auto-hospedada implementa criptografia resistente a ataques quânticos usando ChaCha20-Poly1305 como cifra para bancos de dados SQLite. Essa abordagem protege seus dados de e-mail não apenas contra ameaças atuais, mas também contra futuros ataques de computação quântica.

Cada caixa de correio é armazenada em seu próprio arquivo de banco de dados SQLite criptografado, proporcionando isolamento completo entre usuários — uma vantagem de segurança significativa em relação às abordagens tradicionais de banco de dados compartilhado.

### Manutenção e atualizações automatizadas {#automated-maintenance-and-updates}

Nós criamos utilitários de manutenção abrangentes diretamente na solução auto-hospedada:

1. **Backups Automáticos**: Backups agendados de todos os dados críticos
2. **Renovação de Certificado**: Gerenciamento automatizado de certificados Let's Encrypt
3. **Atualizações do Sistema**: Comando simples para atualizar para a versão mais recente
4. **Monitoramento de Saúde**: Verificações integradas para garantir a integridade do sistema

Esses utilitários são acessíveis por meio de um menu interativo simples:

```bash
# script prompt

1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

## O Compromisso de Código Aberto {#the-open-source-commitment}

Nossa solução de e-mail auto-hospedada, assim como todos os nossos produtos, é 100% de código aberto, tanto no front-end quanto no back-end. Isso significa:

1. **Transparência total**: Cada linha de código que processa seus e-mails está disponível para análise pública.
2. **Contribuições da comunidade**: Qualquer pessoa pode contribuir com melhorias ou corrigir problemas.
3. **Segurança por meio da transparência**: Vulnerabilidades podem ser identificadas e corrigidas por uma comunidade global.
4. **Sem dependência de fornecedores**: Você nunca depende da existência da nossa empresa.

A base de código completa está disponível no GitHub em <https://github.com/forwardemail/forwardemail.net>.

## Auto-hospedado vs. gerenciado: fazendo a escolha certa {#self-hosted-vs-managed-making-the-right-choice}

Embora tenhamos orgulho de oferecer uma opção de auto-hospedagem, reconhecemos que ela não é a escolha certa para todos. A auto-hospedagem de e-mails traz consigo responsabilidades e desafios reais:

### A realidade da auto-hospedagem de e-mail {#the-reality-of-self-hosting-email}

#### Considerações técnicas {#technical-considerations}

* **Gerenciamento de Servidores**: Você precisará manter um VPS ou servidor dedicado
* **Configuração de DNS**: A configuração correta do DNS é fundamental para a entregabilidade
* **Atualizações de Segurança**: Manter-se atualizado com os patches de segurança é essencial
* **Gerenciamento de Spam**: Você precisará lidar com a filtragem de spam
* **Estratégia de Backup**: Implementar backups confiáveis é sua responsabilidade

#### Investimento de tempo {#time-investment}

* **Configuração Inicial**: Tempo para configurar, verificar e ler a documentação
* **Manutenção Contínua**: Atualizações e monitoramento ocasionais
* **Solução de Problemas**: Tempo ocasional para resolução de problemas

#### Considerações financeiras {#financial-considerations}

* **Custos do Servidor**: US$ 5 a US$ 20/mês para um VPS básico
* **Registro de Domínio**: US$ 10 a US$ 20/ano
* **Valor do Tempo**: Seu investimento de tempo tem valor real

### Quando escolher nosso serviço gerenciado {#when-to-choose-our-managed-service}

Para muitos usuários, nosso serviço gerenciado continua sendo a melhor opção:

1. **Conveniência**: Cuidamos de toda a manutenção, atualizações e monitoramento
2. **Confiabilidade**: Beneficie-se de nossa infraestrutura e expertise consolidadas
3. **Suporte**: Obtenha ajuda quando surgirem problemas
4. **Entregabilidade**: Aproveite nossa reputação de propriedade intelectual consolidada
5. **Custo-benefício**: Quando você considera o tempo gasto, nosso serviço costuma ser mais econômico

Ambas as opções oferecem os mesmos benefícios de privacidade e transparência de código aberto — a diferença é simplesmente quem gerencia a infraestrutura.

## Introdução ao encaminhamento de e-mail auto-hospedado {#getting-started-with-self-hosted-forward-email}

Pronto para assumir o controle da sua infraestrutura de e-mail? Veja como começar:

### Requisitos do sistema {#system-requirements}

* Ubuntu 20.04 LTS ou mais recente (recomendado)
* Mínimo de 1 GB de RAM (recomenda-se 2 GB ou mais)
* 20 GB de armazenamento recomendado
* Um nome de domínio que você controla
* Endereço IP público com suporte à porta 25
* Capacidade de definir [PTR reverso](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* Suporte a IPv4 e IPv6

> \[!TIP]
> Recomendamos vários provedores de servidores de e-mail em <https://forwardemail.net/blog/docs/best-mail-server-providers> (fonte em <https://github.com/forwardemail/awesome-mail-server-providers>)

### Etapas de instalação do {#installation-steps}

1. **Execute o script de instalação**:
```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **Siga as instruções interativas**:
* Insira seu nome de domínio
* Configure as credenciais de administrador
* Configure os registros DNS conforme as instruções
* Escolha suas opções de configuração preferidas

3. **Verificar a instalação**:
Após a conclusão da instalação, você pode verificar se tudo está funcionando:
* Verificando o status do contêiner: `docker ps`
* Enviando um e-mail de teste
* Efetuando login na interface web

## O futuro do e-mail auto-hospedado {#the-future-of-self-hosted-email}

Nossa solução auto-hospedada é apenas o começo. Estamos comprometidos em aprimorar continuamente esta oferta com:

1. **Ferramentas de Administração Aprimoradas**: Gerenciamento web mais poderoso
2. **Opções Adicionais de Autenticação**: Incluindo suporte a chaves de segurança de hardware
3. **Monitoramento Avançado**: Melhores insights sobre a integridade e o desempenho do sistema
4. **Implantação Multisservidor**: Opções para configurações de alta disponibilidade
5. **Melhorias Impulsionadas pela Comunidade**: Incorporando contribuições dos usuários

## Conclusão: Liberdade de e-mail para todos {#conclusion-email-freedom-for-everyone}

O lançamento da nossa solução de e-mail auto-hospedada representa um marco significativo em nossa missão de fornecer serviços de e-mail transparentes e focados em privacidade. Seja qual for a sua escolha, seja o nosso serviço gerenciado ou a opção auto-hospedada, você se beneficiará do nosso compromisso inabalável com os princípios de código aberto e o design que prioriza a privacidade.

O e-mail é importante demais para ser controlado por sistemas proprietários e fechados que priorizam a coleta de dados em detrimento da privacidade do usuário. Com a solução auto-hospedada da Forward Email, temos orgulho de oferecer uma alternativa genuína — que lhe dá controle total sobre suas comunicações digitais.

Acreditamos que a privacidade não é apenas um recurso; é um direito fundamental. E com a nossa opção de e-mail auto-hospedado, estamos tornando esse direito mais acessível do que nunca.

Pronto para assumir o controle do seu e-mail? [Comece hoje mesmo](https://forwardemail.net/self-hosted) ou explore nosso [Repositório GitHub](https://github.com/forwardemail/forwardemail.net) para saber mais.

## Referências {#references}

\[1] Encaminhar e-mail Repositório GitHub: <https://github.com/forwardemail/forwardemail.net>

\[2] Documentação auto-hospedada: <https://forwardemail.net/en/self-hosted>

\[3] Implementação técnica de privacidade de e-mail: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Por que o e-mail de código aberto é importante: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>