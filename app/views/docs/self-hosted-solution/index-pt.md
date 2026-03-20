# Email Auto-Hospedado: Compromisso com o Código Aberto {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="Ilustração da solução de email auto-hospedado" class="rounded-lg" />


## Índice {#table-of-contents}

* [Prefácio](#foreword)
* [Por Que o Email Auto-Hospedado Importa](#why-self-hosted-email-matters)
  * [O Problema com Serviços Tradicionais de Email](#the-problem-with-traditional-email-services)
  * [A Alternativa Auto-Hospedada](#the-self-hosted-alternative)
* [Nossa Implementação Auto-Hospedada: Visão Técnica](#our-self-hosted-implementation-technical-overview)
  * [Arquitetura Baseada em Docker para Simplicidade e Portabilidade](#docker-based-architecture-for-simplicity-and-portability)
  * [Instalação via Script Bash: Acessibilidade e Segurança](#bash-script-installation-accessibility-meets-security)
  * [Criptografia Segura contra Computação Quântica para Privacidade Duradoura](#quantum-safe-encryption-for-future-proof-privacy)
  * [Manutenção e Atualizações Automatizadas](#automated-maintenance-and-updates)
* [O Compromisso com o Código Aberto](#the-open-source-commitment)
* [Auto-Hospedado vs. Gerenciado: Fazendo a Escolha Certa](#self-hosted-vs-managed-making-the-right-choice)
  * [A Realidade do Auto-Hospedagem de Email](#the-reality-of-self-hosting-email)
  * [Quando Escolher Nosso Serviço Gerenciado](#when-to-choose-our-managed-service)
* [Começando com o Forward Email Auto-Hospedado](#getting-started-with-self-hosted-forward-email)
  * [Requisitos do Sistema](#system-requirements)
  * [Passos para Instalação](#installation-steps)
* [O Futuro do Email Auto-Hospedado](#the-future-of-self-hosted-email)
* [Conclusão: Liberdade de Email para Todos](#conclusion-email-freedom-for-everyone)
* [Referências](#references)


## Prefácio {#foreword}

No cenário digital atual, o email continua sendo a espinha dorsal da nossa identidade e comunicação online. No entanto, à medida que as preocupações com a privacidade crescem, muitos usuários enfrentam uma escolha difícil: conveniência ao custo da privacidade, ou privacidade ao custo da conveniência. Na Forward Email, sempre acreditamos que você não deveria ter que escolher entre os dois.

Hoje, estamos entusiasmados em anunciar um marco significativo em nossa jornada: o lançamento da nossa solução de email auto-hospedado. Este recurso representa nosso compromisso mais profundo com os princípios de código aberto, design focado na privacidade e empoderamento do usuário. Com nossa opção auto-hospedada, colocamos todo o poder e controle da sua comunicação por email diretamente em suas mãos.

Este post no blog explora a filosofia por trás da nossa solução auto-hospedada, sua implementação técnica e por que ela é importante para usuários que priorizam tanto a privacidade quanto a propriedade em suas comunicações digitais.


## Por Que o Email Auto-Hospedado Importa {#why-self-hosted-email-matters}

Nossa solução de email auto-hospedado é a expressão mais clara da nossa crença de que verdadeira privacidade significa controle, e controle começa com código aberto. Para usuários que exigem total propriedade sobre suas comunicações digitais, o auto-hospedagem não é mais uma ideia marginal — é um direito essencial. Temos orgulho de apoiar essa crença com uma plataforma totalmente aberta e verificável que você pode executar nos seus próprios termos.

### O Problema com Serviços Tradicionais de Email {#the-problem-with-traditional-email-services}

Serviços tradicionais de email apresentam vários desafios fundamentais para usuários preocupados com a privacidade:

1. **Requisitos de Confiança**: Você deve confiar que o provedor não acessará, analisará ou compartilhará seus dados
2. **Controle Centralizado**: Seu acesso pode ser revogado a qualquer momento por qualquer motivo
3. **Vulnerabilidade à Vigilância**: Serviços centralizados são alvos principais para vigilância
4. **Transparência Limitada**: A maioria dos serviços usa software proprietário e fechado
5. **Dependência do Fornecedor**: Migrar para fora desses serviços pode ser difícil ou impossível

Mesmo provedores de email "focados em privacidade" frequentemente falham ao apenas liberar o código-fonte de suas aplicações frontend enquanto mantêm seus sistemas backend proprietários e fechados. Isso cria uma lacuna significativa de confiança — você é convidado a acreditar nas promessas de privacidade deles sem a capacidade de verificá-las.

### A Alternativa Auto-Hospedada {#the-self-hosted-alternative}
Hospedar seu próprio e-mail oferece uma abordagem fundamentalmente diferente:

1. **Controle Completo**: Você possui e controla toda a infraestrutura de e-mail
2. **Privacidade Verificável**: Todo o sistema é transparente e auditável
3. **Sem Necessidade de Confiança**: Você não precisa confiar em terceiros com suas comunicações
4. **Liberdade de Personalização**: Adapte o sistema às suas necessidades específicas
5. **Resiliência**: Seu serviço continua independentemente das decisões de qualquer empresa

Como um usuário disse: "Hospedar meu próprio e-mail é o equivalente digital de cultivar minha própria comida—exige mais trabalho, mas eu sei exatamente o que tem nele."


## Nossa Implementação Self-Hosted: Visão Técnica {#our-self-hosted-implementation-technical-overview}

Nossa solução de e-mail self-hosted é construída com os mesmos princípios de privacidade que orientam todos os nossos produtos. Vamos explorar a implementação técnica que torna isso possível.

### Arquitetura Baseada em Docker para Simplicidade e Portabilidade {#docker-based-architecture-for-simplicity-and-portability}

Empacotamos toda a nossa infraestrutura de e-mail usando Docker, facilitando a implantação em praticamente qualquer sistema baseado em Linux. Essa abordagem conteinerizada oferece vários benefícios chave:

1. **Implantação Simplificada**: Um único comando configura toda a infraestrutura
2. **Ambiente Consistente**: Elimina problemas de "funciona na minha máquina"
3. **Componentes Isolados**: Cada serviço roda em seu próprio container para segurança
4. **Atualizações Fáceis**: Comandos simples para atualizar toda a stack
5. **Dependências Mínimas**: Requer apenas Docker e Docker Compose

A arquitetura inclui containers para:

* Interface web para administração
* Servidor SMTP para envio de e-mails
* Servidores IMAP/POP3 para recebimento de e-mails
* Servidor CalDAV para calendários
* Servidor CardDAV para contatos
* Banco de dados para armazenamento de configurações
* Redis para cache e desempenho
* SQLite para armazenamento seguro e criptografado das caixas de correio

> \[!NOTE]
> Não deixe de conferir nosso [guia para desenvolvedores self-hosted](https://forwardemail.net/self-hosted)

### Instalação via Script Bash: Acessibilidade com Segurança {#bash-script-installation-accessibility-meets-security}

Projetamos o processo de instalação para ser o mais simples possível, mantendo as melhores práticas de segurança:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

Este único comando:

1. Verifica os requisitos do sistema
2. Guia você pela configuração
3. Configura os registros DNS
4. Configura os certificados TLS
5. Implanta os containers Docker
6. Realiza o endurecimento inicial de segurança

Para quem se preocupa em passar scripts diretamente para o bash (como deve!), recomendamos revisar o script antes da execução. Ele é totalmente open-source e disponível para inspeção.

### Criptografia Segura Contra Computação Quântica para Privacidade à Prova do Futuro {#quantum-safe-encryption-for-future-proof-privacy}

Assim como nosso serviço hospedado, nossa solução self-hosted implementa criptografia resistente a ataques quânticos usando ChaCha20-Poly1305 como cifra para bancos de dados SQLite. Essa abordagem protege seus dados de e-mail não apenas contra ameaças atuais, mas também contra futuros ataques de computação quântica.

Cada caixa de correio é armazenada em seu próprio arquivo de banco de dados SQLite criptografado, proporcionando isolamento completo entre usuários—uma vantagem significativa de segurança em relação às abordagens tradicionais de banco de dados compartilhado.

### Manutenção e Atualizações Automatizadas {#automated-maintenance-and-updates}

Construímos utilitários abrangentes de manutenção diretamente na solução self-hosted:

1. **Backups Automáticos**: Backups agendados de todos os dados críticos
2. **Renovação de Certificados**: Gerenciamento automatizado de certificados Let's Encrypt
3. **Atualizações do Sistema**: Comando simples para atualizar para a versão mais recente
4. **Monitoramento de Saúde**: Verificações integradas para garantir a integridade do sistema

Esses utilitários são acessíveis através de um menu interativo simples:

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


## O Compromisso Open-Source {#the-open-source-commitment}

Nossa solução de e-mail self-hosted, como todos os nossos produtos, é 100% open-source—tanto frontend quanto backend. Isso significa:
1. **Transparência Completa**: Cada linha de código que processa seus e-mails está disponível para escrutínio público  
2. **Contribuições da Comunidade**: Qualquer pessoa pode contribuir com melhorias ou corrigir problemas  
3. **Segurança pela Abertura**: Vulnerabilidades podem ser identificadas e corrigidas por uma comunidade global  
4. **Sem Dependência de Fornecedor**: Você nunca fica dependente da existência da nossa empresa  

Todo o código-fonte está disponível no GitHub em <https://github.com/forwardemail/forwardemail.net>.


## Self-Hosted vs. Managed: Fazendo a Escolha Certa {#self-hosted-vs-managed-making-the-right-choice}

Embora tenhamos orgulho em oferecer uma opção self-hosted, reconhecemos que não é a escolha certa para todos. Hospedar seu próprio e-mail traz responsabilidades e desafios reais:

### A Realidade de Hospedar Seu Próprio E-mail {#the-reality-of-self-hosting-email}

#### Considerações Técnicas {#technical-considerations}

* **Gerenciamento do Servidor**: Você precisará manter um VPS ou servidor dedicado  
* **Configuração de DNS**: A configuração correta do DNS é crítica para a entregabilidade  
* **Atualizações de Segurança**: Manter-se atualizado com patches de segurança é essencial  
* **Gerenciamento de Spam**: Você precisará lidar com filtragem de spam  
* **Estratégia de Backup**: Implementar backups confiáveis é sua responsabilidade  

#### Investimento de Tempo {#time-investment}

* **Configuração Inicial**: Tempo para configurar, verificar e ler a documentação  
* **Manutenção Contínua**: Atualizações ocasionais e monitoramento  
* **Resolução de Problemas**: Tempo ocasional para resolver questões  

#### Considerações Financeiras {#financial-considerations}

* **Custos do Servidor**: $5-$20/mês para um VPS básico  
* **Registro de Domínio**: $10-$20/ano  
* **Valor do Tempo**: Seu investimento de tempo tem valor real  

### Quando Escolher Nosso Serviço Gerenciado {#when-to-choose-our-managed-service}

Para muitos usuários, nosso serviço gerenciado continua sendo a melhor opção:

1. **Conveniência**: Nós cuidamos de toda a manutenção, atualizações e monitoramento  
2. **Confiabilidade**: Beneficie-se da nossa infraestrutura estabelecida e expertise  
3. **Suporte**: Obtenha ajuda quando surgirem problemas  
4. **Entregabilidade**: Aproveite nossa reputação de IP estabelecida  
5. **Custo-Benefício**: Quando você considera o custo do tempo, nosso serviço geralmente é mais econômico  

Ambas as opções oferecem os mesmos benefícios de privacidade e transparência open-source — a diferença é simplesmente quem gerencia a infraestrutura.


## Começando com o Forward Email Self-Hosted {#getting-started-with-self-hosted-forward-email}

Pronto para assumir o controle da sua infraestrutura de e-mail? Veja como começar:

### Requisitos do Sistema {#system-requirements}

* Ubuntu 20.04 LTS ou mais recente (recomendado)  
* Mínimo de 1GB de RAM (2GB+ recomendado)  
* 20GB de armazenamento recomendado  
* Um nome de domínio que você controla  
* Endereço IP público com suporte à porta 25  
* Capacidade de configurar [PTR reverso](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)  
* Suporte a IPv4 e IPv6  

> \[!TIP]  
> Recomendamos vários provedores de servidor de e-mail em <https://forwardemail.net/blog/docs/best-mail-server-providers> (fonte em <https://github.com/forwardemail/awesome-mail-server-providers>)  

### Passos para Instalação {#installation-steps}

1. **Execute o Script de Instalação**:  
   ```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **Siga as Instruções Interativas**:  
   * Insira seu nome de domínio  
   * Configure as credenciais do administrador  
   * Configure os registros DNS conforme instruído  
   * Escolha suas opções de configuração preferidas  

3. **Verifique a Instalação**:  
   Após a conclusão da instalação, você pode verificar se tudo está funcionando:  
   * Verificando o status do container: `docker ps`  
   * Enviando um e-mail de teste  
   * Acessando a interface web  


## O Futuro do E-mail Self-Hosted {#the-future-of-self-hosted-email}

Nossa solução self-hosted é apenas o começo. Estamos comprometidos em melhorar continuamente esta oferta com:

1. **Ferramentas de Administração Aprimoradas**: Gestão web mais poderosa  
2. **Opções Adicionais de Autenticação**: Incluindo suporte a chave de segurança física  
3. **Monitoramento Avançado**: Melhores insights sobre saúde e desempenho do sistema  
4. **Implantação Multi-Servidor**: Opções para configurações de alta disponibilidade  
5. **Melhorias Guiadas pela Comunidade**: Incorporando contribuições dos usuários
## Conclusão: Liberdade de Email para Todos {#conclusion-email-freedom-for-everyone}

O lançamento da nossa solução de email auto-hospedada representa um marco significativo em nossa missão de fornecer serviços de email focados em privacidade e transparência. Seja você optar pelo nosso serviço gerenciado ou pela opção auto-hospedada, você se beneficia do nosso compromisso inabalável com os princípios de código aberto e design com foco na privacidade.

O email é importante demais para ser controlado por sistemas fechados e proprietários que priorizam a coleta de dados em detrimento da privacidade do usuário. Com a solução auto-hospedada do Forward Email, temos orgulho em oferecer uma alternativa genuína — que coloca você no controle completo das suas comunicações digitais.

Acreditamos que a privacidade não é apenas um recurso; é um direito fundamental. E com nossa opção de email auto-hospedado, estamos tornando esse direito mais acessível do que nunca.

Pronto para assumir o controle do seu email? [Comece hoje mesmo](https://forwardemail.net/self-hosted) ou explore nosso [repositório no GitHub](https://github.com/forwardemail/forwardemail.net) para saber mais.


## Referências {#references}

\[1] Repositório Forward Email no GitHub: <https://github.com/forwardemail/forwardemail.net>

\[2] Documentação Auto-Hospedada: <https://forwardemail.net/en/self-hosted>

\[3] Implementação Técnica da Privacidade no Email: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Por que o Email Open-Source é Importante: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>
