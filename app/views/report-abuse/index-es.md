# Reportar abuso {#report-abuse}

<img loading="lazy" src="/img/articles/report-abuse.webp" alt="Reportar abuso y spam a Forward Email" class="rounded-lg" />


## Tabla de contenidos {#table-of-contents}

* [Aviso legal](#disclaimer)
* [Cómo enviar un informe de abuso](#how-to-submit-an-abuse-report)
* [Para el público en general](#for-the-general-public)
* [Para las fuerzas del orden](#for-law-enforcement)
  * [Qué información está disponible](#what-information-is-available)
  * [Qué información no está disponible](#what-information-is-not-available)
  * [Fuerzas del orden con base en Estados Unidos](#law-enforcement-based-in-the-united-states)
  * [Fuerzas del orden con base fuera de Estados Unidos](#law-enforcement-based-outside-of-the-united-states)
  * [Solicitudes de emergencia de las fuerzas del orden](#law-enforcement-emergency-requests)
  * [Las solicitudes de las fuerzas del orden pueden activar avisos de cuenta](#law-enforcement-requests-may-trigger-account-notices)
  * [Solicitudes de las fuerzas del orden para preservar información](#law-enforcement-requests-to-preserve-information)
  * [Notificación de proceso a las fuerzas del orden](#law-enforcement-serving-process)


## Aviso legal {#disclaimer}

Por favor, consulte nuestros [Términos](/terms) ya que se aplican en todo el sitio.


## Cómo enviar un informe de abuso {#how-to-submit-an-abuse-report}

Revisamos los informes de abuso y atendemos solicitudes de información para el [público en general](#for-the-general-public) y las [fuerzas del orden](#for-law-enforcement) caso por caso por correo electrónico.

Los informes de abuso y las solicitudes de información relacionadas con usuarios, correos electrónicos, direcciones IP y/o dominios se denominan colectivamente como una "Cuenta" a continuación.

Nuestras direcciones de correo electrónico para contactar con su solicitud o informe sobre abuso son: `support@forwardemail.net`, `abuse@forwardemail.net` y `security@forwardemail.net`.

Por favor, envíe una copia a todas estas direcciones de correo electrónico si es posible, y también envíe correos de recordatorio si no respondemos dentro de 24-48+ horas.

Lea las secciones a continuación para obtener más información que pueda aplicarse a usted.


## Para el público en general {#for-the-general-public}

<u>**Si usted o alguien más está en peligro inminente, por favor contacte a la policía y servicios de emergencia inmediatamente.**</u>

<u>**Debe buscar asesoría legal profesional para recuperar el acceso perdido a su Cuenta o para ayudar a detener a un actor malicioso.**</u>

Si usted es víctima de abuso de una Cuenta que está usando nuestro servicio, por favor envíenos su informe por correo electrónico a la dirección arriba indicada. Si su Cuenta fue tomada por un actor malicioso (por ejemplo, su dominio expiró recientemente y fue re-registrado por un tercero y luego usado para abuso), por favor envíenos un informe a la dirección arriba indicada con la información exacta de su Cuenta (por ejemplo, el nombre de su dominio). Podemos ayudar a [shadow ban](https://en.wikipedia.org/wiki/Shadow_banning) la Cuenta después de validar su propiedad previa. Tenga en cuenta que no tenemos autoridad para ayudarle a recuperar el acceso a su Cuenta.

Su representante legal puede aconsejarle contactar a las fuerzas del orden, al propietario de su Cuenta (por ejemplo, el registrador del nombre de dominio; el sitio web donde registró el nombre de dominio), y/o remitirle a la [página de ICANN sobre dominios perdidos](https://www.icann.org/resources/pages/lost-domain-names).


## Para las fuerzas del orden {#for-law-enforcement}

Para la mayoría de las solicitudes, nuestra capacidad para divulgar información está regulada por la [Ley de Privacidad de Comunicaciones Electrónicas](https://bja.ojp.gov/program/it/privacy-civil-liberties/authorities/statutes/1285) ([Wikipedia](https://en.wikipedia.org/wiki/Electronic_Communications_Privacy_Act)), [18 U.S.C. 2701](https://www.govinfo.gov/link/uscode/18/2701), y siguientes ("ECPA"). La ECPA exige que divulguemos cierta información de usuarios a las fuerzas del orden solo en respuesta a tipos específicos de solicitudes legales, incluyendo citaciones, órdenes judiciales y órdenes de registro.

Si usted es miembro de las fuerzas del orden y busca información sobre una Cuenta, la información de la Cuenta así como el rango de fecha y hora deben incluirse en su solicitud. No podemos procesar solicitudes demasiado amplias y/o vagas – esto es para proteger los datos y la confianza de nuestros usuarios, y lo más importante, para mantener sus datos seguros.
Si su solicitud nos indica una violación de nuestros [Términos](/terms), entonces la procesaremos de acuerdo con nuestras mejores prácticas internas exclusivas para el manejo de abusos; tenga en cuenta que en algunos casos esto puede resultar en la suspensión y/o prohibición de la Cuenta.

**Dado que no somos un registrador de nombres de dominio**, si desea buscar información histórica de registros DNS sobre un nombre de dominio, debe contactar al registrador de nombres de dominio específico que corresponde al dominio. Servicios como [Security Trails]() pueden proporcionar búsquedas de registros históricos, pero información más específica y precisa puede ser proporcionada por el registrador. Para determinar quién es el registrador del nombre de dominio y/o los propietarios de los servidores de nombres DNS de un dominio, las herramientas `dig` y `whois` pueden ser útiles (por ejemplo, `whois example.com` o `dig example.com ns`). Puede determinar si una Cuenta está en un plan pago o gratuito en nuestro servicio realizando una búsqueda de registros DNS (por ejemplo, `dig example.com mx` y `dig example.com txt`). Si los registros MX no devuelven valores como `mx1.forwardemail.net` y `mx2.forwardemail.net`, entonces el dominio no está usando nuestro servicio. Si los registros TXT devuelven una dirección de correo electrónico en texto plano (por ejemplo, `forward-email=user@example.com`), eso indica la dirección de destino del reenvío de correo electrónico para un dominio. Si en cambio devuelve un valor como `forward-email-site-verification=XXXXXXXXXX`, eso indica que está en un plan pago y la configuración de reenvío está almacenada en nuestra base de datos bajo el ID `XXXXXXXXXX`. Para más información sobre cómo funciona nuestro servicio a nivel DNS, consulte nuestra [FAQ](/faq).

### Qué información está disponible {#what-information-is-available}

Consulte la sección de nuestra Política de Privacidad sobre [Información Recopilada](/privacy#information-collected). Las Cuentas pueden eliminar su información de nuestro sistema en cumplimiento con las leyes de retención de datos y privacidad; consulte la sección de nuestra Política de Privacidad sobre [Eliminación de Información](/privacy#information-removal). Esto significa que la información solicitada puede no estar disponible en el momento de la solicitud debido a la eliminación de la Cuenta.

### Qué información no está disponible {#what-information-is-not-available}

Consulte la sección de nuestra Política de Privacidad sobre [Información No Recopilada](/privacy#information-not-collected).

### Autoridades policiales con base en Estados Unidos {#law-enforcement-based-in-the-united-states}

Con la [excepción de emergencias](#law-enforcement-emergency-requests), compartimos la información de la Cuenta solo tras recibir una citación válida, una orden judicial ECPA de EE. UU. y/o una orden de registro.

Además, podemos [notificar a una Cuenta](#law-enforcement-requests-may-trigger-account-notices) sobre una solicitud de las autoridades, a menos que la ley o una orden judicial nos prohíban hacerlo.

Si recibimos una citación válida, orden judicial ECPA y/o orden de registro, proporcionaremos la información relevante y disponible en la medida de nuestras capacidades.

### Autoridades policiales con base fuera de Estados Unidos {#law-enforcement-based-outside-of-the-united-states}

Requerimos que las solicitudes para autoridades policiales con base fuera de Estados Unidos se sirvan a través de uno de los siguientes medios:

* Un tribunal de Estados Unidos.
* Una agencia de cumplimiento bajo los procedimientos de un [tratado de asistencia legal mutua de Estados Unidos](https://www.justice.gov/criminal-oia/file/1498806/download) ([Wikipedia](https://en.wikipedia.org/wiki/Mutual_legal_assistance_treaty)) ("MLAT").
* Una orden de un gobierno extranjero que esté sujeta a un acuerdo ejecutivo que el Fiscal General de Estados Unidos haya determinado y certificado ante el Congreso que cumple con los requisitos de [18 U.S.C. 2523](https://www.govinfo.gov/link/uscode/18/2523).

### Solicitudes de emergencia de las autoridades policiales {#law-enforcement-emergency-requests}

Según lo permite la ley en Estados Unidos (por ejemplo, de conformidad con [18 U.S.C. §2702 (b)(8)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(8\)to%20a%20governmental%20entity%2C%20if%20the%20provider%2C%20in%20good%20faith%2C%20believes%20that%20an%20emergency%20involving%20danger%20of%20death%20or%20serious%20physical%20injury%20to%20any%20person%20requires%20disclosure%20without%20delay%20of%20communications%20relating%20to%20the%20emergency%3B%20or) y [§2702 (c)](https://www.law.cornell.edu/uscode/text/18/2702#:\~:text=\(c\)Exceptions%20for%20Disclosure%20of%20Customer%20Records.%E2%80%94A%20provider%20described%20in%20subsection%20\(a\)%20may%20divulge%20a%20record%20or%20other%20information%20pertaining%20to%20a%20subscriber%20to%20or%20customer%20of%20such%20service%20\(not%20including%20the%20contents%20of%20communications%20covered%20by%20subsection%20\(a\)\(1\)%20or%20\(a\)\(2\)\)%E2%80%94)), cuando actuamos de buena fe y con verificación independiente del solicitante, podemos divulgar y compartir información de la Cuenta con las autoridades sin una citación, orden judicial ECPA y/o orden de registro cuando creemos que hacerlo sin demora es necesario para prevenir la muerte o lesiones físicas graves.
Requerimos que las solicitudes de datos de emergencia ("EDR") se envíen por correo electrónico e incluyan toda la información relevante para proporcionar un proceso oportuno y acelerado.

Tenga en cuenta que estamos al tanto de ataques sofisticados de suplantación, phishing e impersonación por correo electrónico (por ejemplo, vea [este artículo de The Guardian](https://www.theguardian.com/technology/2022/apr/04/us-law-enforcement-agencies-access-your-data-apple-meta#:\~:text=A%20hack%20using%20a%20forged%20legal%20request%20that%20exposed%20consumer%20data%20collected%20by%20Apple%20and%20Meta%20shed%20light%20on%20the%20reach%20of%20the%20law)).

Nuestra política para procesar las EDR es la siguiente:

1. Investigar de forma independiente los metadatos del encabezado del correo electrónico (por ejemplo, DKIM/SPF/DMARC) (o la ausencia de los mismos) para su verificación.

2. Hacer nuestro mejor esfuerzo de buena fe (con intentos repetidos si es necesario) para contactar de forma independiente por teléfono al solicitante, con el fin de confirmar la autenticidad de la solicitud. Por ejemplo, podemos investigar el sitio web `.gov` relacionado con la jurisdicción de donde proviene la solicitud, y luego llamar a la oficina desde su número telefónico oficial listado públicamente para verificar la solicitud.

### Las solicitudes de las fuerzas del orden pueden activar notificaciones en la cuenta {#law-enforcement-requests-may-trigger-account-notices}

Podemos notificar a una Cuenta y proporcionarle una copia de una solicitud de las fuerzas del orden que le concierna, a menos que la ley o una orden judicial nos prohíba hacerlo (por ejemplo, [18 U.S.C. 2705(b)](https://www.govinfo.gov/link/uscode/18/2705)). En esos casos, si aplica, podemos notificar a una Cuenta cuando la orden de no divulgación haya expirado.

Si una solicitud de información por parte de las fuerzas del orden es válida, entonces [preservaremos la información necesaria y solicitada de la Cuenta](#law-enforcement-requests-to-preserve-information) y haremos un esfuerzo razonable para contactar al propietario de la Cuenta mediante su dirección de correo electrónico registrada y verificada (por ejemplo, dentro de 7 días naturales). Si recibimos una objeción oportuna (por ejemplo, dentro de 7 días naturales), entonces retendremos la información de la Cuenta y continuaremos el proceso legal según sea necesario.

### Solicitudes de las fuerzas del orden para preservar información {#law-enforcement-requests-to-preserve-information}

Respetaremos las solicitudes válidas de las fuerzas del orden para preservar información relacionada con una Cuenta conforme a [18 U.S.C. 2703(f)](https://www.govinfo.gov/link/uscode/18/2703). Tenga en cuenta que la preservación de datos está restringida únicamente a lo que se solicita específicamente y está disponible en el momento.

### Notificación de proceso a las fuerzas del orden {#law-enforcement-serving-process}

Requerimos que todas las solicitudes válidas de las fuerzas del orden nos proporcionen una dirección de correo electrónico válida y funcional a la cual podamos corresponder y proporcionar la información solicitada electrónicamente.

Todas las solicitudes deben enviarse a la dirección de correo electrónico especificada en [Cómo enviar un informe de abuso](#how-to-submit-an-abuse-report) arriba.

Todas las solicitudes de las fuerzas del orden deben enviarse en papel membretado de la agencia o departamento (por ejemplo, como un archivo PDF escaneado adjunto), desde una dirección de correo electrónico oficial y relevante, y deben estar firmadas.

Si se trata de una [solicitud de emergencia](#law-enforcement-emergency-requests), por favor escriba "Solicitud de emergencia de las fuerzas del orden" en el encabezado Asunto del correo electrónico.

Tenga en cuenta que puede tomarnos al menos dos semanas poder revisar y responder a su solicitud.
