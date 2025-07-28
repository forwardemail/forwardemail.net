# Zásady ochrany osobních údajů {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="" class="rounded-lg" />

__CHRÁNĚNÁ_URL_5__ Obsah {__CHRÁNĚNÁ_URL_6__

* [Zřeknutí se odpovědnosti](#disclaimer)
* [Informace nebyly shromážděny](#information-not-collected)
* [Shromážděné informace](#information-collected)
* [Informace sdíleny](#information-shared)
* [Odstranění informací](#information-removal)
* [Další zveřejnění](#additional-disclosures)

## Prohlášení o vyloučení odpovědnosti {#disclaimer}

Řiďte se prosím našimi [Podmínky](/terms), protože platí pro celý web.

## Informace nebyly shromážděny {#information-not-collected}

**S výjimkou [chyby](/faq#do-you-store-error-logs), [odchozí e-maily SMTP](/faq#do-you-support-sending-email-with-smtp) a/nebo v případě detekce spamu či škodlivé aktivity (např. pro omezení rychlosti):**

* Neukládáme žádné přeposlané e-maily na disk ani do databází.
* Neukládáme žádná metadata o e-mailech na disk ani do databází.
* Neukládáme žádné protokoly ani IP adresy na disk ani do databází.

## Shromážděné informace {#information-collected}

Z důvodu transparentnosti si můžete kdykoli <a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">prohlédnout náš zdrojový kód</a> a zjistit, jak se shromažďují a používají níže uvedené informace:

**Výhradně z důvodu funkčnosti a zlepšení našich služeb shromažďujeme a bezpečně ukládáme následující informace:**

* E-maily a informace z kalendáře ukládáme do vašeho [šifrovaná databáze SQLite](/blog/docs/best-quantum-safe-encrypted-email-service) výhradně pro váš přístup a funkčnost poštovní schránky přes IMAP/POP3/CalDAV/CardDAV.
* Upozorňujeme, že pokud používáte pouze naše služby pro přesměrování e-mailů, žádné e-maily se neukládají na disk ani do databázového úložiště, jak je popsáno v [Informace nebyly shromážděny](#information-not-collected).
* Naše služby pro přesměrování e-mailů fungují pouze v paměti (nezapisují se na disk ani do databází).
* Úložiště IMAP/POP3/CalDAV/CardDAV je šifrované v klidu, šifrované během přenosu a uloženo na disku šifrovaném pomocí LUKS.
* Zálohy vašeho úložiště IMAP/POP3/CalDAV/CardDAV jsou šifrované v klidu, šifrované během přenosu a uloženy na [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/). * V rámci relace ukládáme soubor cookie pro návštěvnost vašich webových stránek. * Ukládáme vaši e-mailovou adresu, kterou nám poskytnete.
* Ukládáme názvy vašich domén, aliasy a konfigurace, které nám poskytnete.
* Kódy odpovědi SMTP `4xx` a `5xx` [protokoly chyb](/faq#do-you-store-error-logs) ukládáme po dobu 7 dnů.
* Kód [odchozí e-maily SMTP](/faq#do-you-support-sending-email-with-smtp) ukládáme po dobu ~30 dnů.
* Tato délka se liší v závislosti na hlavičce „Date“, protože povolujeme odesílání e-mailů v budoucnu, pokud existuje budoucí hlavička „Date“.
* **Upozorňujeme, že jakmile je e-mail úspěšně doručen nebo trvale chybí, tělo zprávy redigujeme a odstraníme.**
* Pokud chcete nakonfigurovat tělo odchozí e-mailové zprávy SMTP tak, aby bylo uchováváno déle než výchozí hodnota 0 dnů (po úspěšném doručení nebo trvalé chybě), přejděte do Pokročilé nastavení vaší domény a zadejte hodnotu mezi `0` a `30`.
* Někteří uživatelé rádi používají funkci náhledu [Můj účet > E-maily](/my-account/emails), aby viděli, jak se jejich e-maily vykreslují, proto podporujeme konfigurovatelnou dobu uchovávání.
* Upozorňujeme, že podporujeme také [OpenPGP/E2EE](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd).
* Veškeré další informace, které nám dobrovolně poskytnete, jako například komentáře nebo otázky zaslané e-mailem nebo na naší stránce <a href="/help">nápovědy</a>.

## Sdílené informace {#information-shared}

Vaše údaje nesdílíme s žádnými třetími stranami.  Také nepoužíváme žádné analytické ani telemetrické softwarové služby třetích stran.

Můžeme být nuceni vyhovět soudním žádostem nařízeným právním orgánům a také je budeme splňovat (mějte však na paměti [neshromažďujeme informace uvedené výše v části „Neshromažďované informace“](#information-not-collected), takže vám je nebudeme moci poskytnout).

## Odstranění informací {#information-removal}

Pokud si kdykoli přejete odstranit informace, které jste nám poskytli, přejděte do sekce <a href="/my-account/security">Můj účet > Zabezpečení</a> a klikněte na tlačítko „Smazat účet“.

Z důvodu prevence a zmírňování zneužití může být nutné, aby váš účet ručně zkontrolovali naši administrátoři, pokud jej smažete do 5 dnů od první platby.

Tento proces obvykle trvá méně než 24 hodin a byl zaveden, protože uživatelé rozesílali spam v naší službě a poté rychle mazali své účty – což nám zabránilo v zablokování otisků prstů jejich platebních metod ve Stripe.

## Další informace {#additional-disclosures}

Tyto stránky jsou chráněny službou Cloudflare a platí pro ně podmínky [Zásady ochrany osobních údajů](https://www.cloudflare.com/privacypolicy/) a [Podmínky služby](https://www.cloudflare.com/website-terms/).