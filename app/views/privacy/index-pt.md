# Política de Privacidade {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email privacy policy" class="rounded-lg" />

## Índice {#table-of-contents}

* [Isenção de responsabilidade](#disclaimer)
* [Informações não coletadas](#information-not-collected)
* [Informações coletadas](#information-collected)
* [Informações compartilhadas](#information-shared)
* [Remoção de informações](#information-removal)
* [Divulgações adicionais](#additional-disclosures)

## Isenção de responsabilidade {#disclaimer}

Por favor, consulte nosso [Termos](/terms), pois ele se aplica a todo o site.

## Informações não coletadas {#information-not-collected}

**Com exceção de [erros](/faq#do-you-store-error-logs), [e-mails SMTP de saída](/faq#do-you-support-sending-email-with-smtp) e/ou quando spam ou atividade maliciosa for detectada (por exemplo, para limitação de taxa):**

* Não armazenamos e-mails encaminhados em disco nem em bancos de dados.
* Não armazenamos metadados sobre e-mails em disco nem em bancos de dados.
* Não armazenamos logs ou endereços IP em disco nem em bancos de dados.

## Informações coletadas {#information-collected}

Para transparência, a qualquer momento você pode <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">visualizar nosso código-fonte</a> para ver como as informações abaixo são coletadas e usadas:

**Estritamente para funcionalidade e para melhorar nosso serviço, coletamos e armazenamos com segurança as seguintes informações:**

* Armazenamos e-mails e informações de calendário em seu [banco de dados SQLite criptografado](/blog/docs/best-quantum-safe-encrypted-email-service) estritamente para seu acesso IMAP/POP3/CalDAV/CardDAV e funcionalidade de caixa de correio.
* Observe que, se você estiver usando apenas nossos serviços de encaminhamento de e-mail, nenhum e-mail será armazenado em disco ou banco de dados, conforme descrito em [Informações não coletadas](#information-not-collected).
* Nossos serviços de encaminhamento de e-mail operam apenas na memória (sem gravação em disco ou bancos de dados).
* O armazenamento IMAP/POP3/CalDAV/CardDAV é criptografado em repouso, criptografado em trânsito e armazenado em um disco criptografado LUKS.
* Os backups do seu armazenamento IMAP/POP3/CalDAV/CardDAV são criptografados em repouso, criptografado em trânsito e armazenados em [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/).
* Armazenamos um cookie em uma sessão para o tráfego do seu site.
* Armazenamos o endereço de e-mail que você nos fornece.
* Armazenamos seus nomes de domínio, aliases e configurações que você nos fornece.
* Armazenamos os códigos de resposta SMTP `4xx` e `5xx` [registros de erros](/faq#do-you-store-error-logs) por 7 dias.
* Armazenamos [e-mails SMTP de saída](/faq#do-you-support-sending-email-with-smtp) por aproximadamente 30 dias.
* Esse período varia de acordo com o cabeçalho "Data", pois permitimos o envio de e-mails no futuro, caso exista um cabeçalho "Data" no futuro.
* **Observe que, assim que um e-mail for entregue com sucesso ou apresentar erros permanentes, removeremos e removeremos o corpo da mensagem.**
* Se desejar configurar o corpo da mensagem de e-mail SMTP de saída para ser retido por mais tempo do que o padrão de 0 dias (após a entrega com sucesso ou erro permanente), acesse as Configurações Avançadas do seu domínio e insira um valor entre `0` e `30`.

* Alguns usuários gostam de usar o recurso de visualização [Minha conta > E-mails](/my-account/emails) para ver como seus e-mails são renderizados, portanto, oferecemos suporte a um período de retenção configurável.
* Observe que também oferecemos suporte a __PROTECTED_LINK_30__0.
* Quaisquer informações adicionais que você nos fornecer voluntariamente, como comentários ou perguntas enviadas por e-mail ou em nossa página de <a href="/help">ajuda</a>.

## Informações compartilhadas {#information-shared}

Não compartilhamos suas informações com terceiros. Também não utilizamos nenhum serviço de software de análise ou telemetria de terceiros.

Poderemos precisar e cumpriremos solicitações legais determinadas pelo tribunal (mas tenha em mente [não coletamos as informações mencionadas acima em "Informações Não Coletadas"](#information-not-collected), portanto, não poderemos fornecê-lo para começar).

## Remoção de informações {#information-removal}

Se a qualquer momento você desejar remover as informações que nos forneceu, vá para <a href="/my-account/security">Minha Conta > Segurança</a> e clique em "Excluir Conta".

Devido à prevenção e mitigação de abusos, sua conta pode exigir revisão de exclusão manual por nossos administradores se você excluí-la dentro de 5 dias após seu primeiro pagamento.

Esse processo geralmente leva menos de 24 horas e foi implementado porque os usuários estavam enviando spam para nosso serviço e, em seguida, excluindo rapidamente suas contas, o que nos impediu de bloquear suas impressões digitais de método de pagamento no Stripe.

## Divulgações adicionais {#additional-disclosures}

Este site é protegido pelo Cloudflare e seus [política de Privacidade](https://www.cloudflare.com/privacypolicy/) e [Termos de Serviço](https://www.cloudflare.com/website-terms/) se aplicam.