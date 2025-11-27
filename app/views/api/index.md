# Email API


## Table of Contents

* [Libraries](#libraries)
* [Base URI](#base-uri)
* [Authentication](#authentication)
* [Errors](#errors)
* [Localization](#localization)
* [Pagination](#pagination)
* [Logs](#logs)
  * [Retrieve logs](#retrieve-logs)
* [Account](#account)
  * [Create account](#create-account)
  * [Retrieve account](#retrieve-account)
  * [Update account](#update-account)
* [Alias Contacts (CardDAV)](#alias-contacts-carddav)
  * [List contacts](#list-contacts)
  * [Create contact](#create-contact)
  * [Retrieve contact](#retrieve-contact)
  * [Update contact](#update-contact)
  * [Delete contact](#delete-contact)
* [Alias Calendars (CalDAV)](#alias-calendars-caldav)
  * [List calendars](#list-calendars)
  * [Create calendar](#create-calendar)
  * [Retrieve calendar](#retrieve-calendar)
  * [Update calendar](#update-calendar)
  * [Delete calendar](#delete-calendar)
* [Alias Messages (IMAP/POP3)](#alias-messages-imappop3)
  * [List and search for messages](#list-and-search-for-messages)
  * [Create message](#create-message)
  * [Retrieve message](#retrieve-message)
  * [Update message](#update-message)
  * [Delete message](#delete-message)
* [Alias Folders (IMAP/POP3)](#alias-folders-imappop3)
  * [List folders](#list-folders)
  * [Create folder](#create-folder)
  * [Retrieve folder](#retrieve-folder)
  * [Update folder](#update-folder)
  * [Delete folder](#delete-folder)
  * [Copy folder](#copy-folder)
* [Outbound Emails](#outbound-emails)
  * [Get outbound SMTP email limit](#get-outbound-smtp-email-limit)
  * [List outbound SMTP emails](#list-outbound-smtp-emails)
  * [Create outbound SMTP email](#create-outbound-smtp-email)
  * [Retrieve outbound SMTP email](#retrieve-outbound-smtp-email)
  * [Delete outbound SMTP email](#delete-outbound-smtp-email)
* [Domains](#domains)
  * [List domains](#list-domains)
  * [Create domain](#create-domain)
  * [Retrieve domain](#retrieve-domain)
  * [Verify domain records](#verify-domain-records)
  * [Verify domain SMTP records](#verify-domain-smtp-records)
  * [List domain-wide catch-all passwords](#list-domain-wide-catch-all-passwords)
  * [Create domain-wide catch-all password](#create-domain-wide-catch-all-password)
  * [Remove domain-wide catch-all password](#remove-domain-wide-catch-all-password)
  * [Update domain](#update-domain)
  * [Delete domain](#delete-domain)
* [Invites](#invites)
  * [Accept domain invite](#accept-domain-invite)
  * [Create domain invite](#create-domain-invite)
  * [Remove domain invite](#remove-domain-invite)
* [Members](#members)
  * [Update domain member](#update-domain-member)
  * [Remove domain member](#remove-domain-member)
* [Aliases](#aliases)
  * [Generate an alias password](#generate-an-alias-password)
  * [List domain aliases](#list-domain-aliases)
  * [Create new domain alias](#create-new-domain-alias)
  * [Retrieve domain alias](#retrieve-domain-alias)
  * [Update domain alias](#update-domain-alias)
  * [Delete domain alias](#delete-domain-alias)
* [Encrypt](#encrypt)
  * [Encrypt TXT Record](#encrypt-txt-record)


## Libraries

Right now we have not yet released any API wrappers, but we plan to do so in the near future. Send an email to <api@forwardemail.net> if you would like to be notified when a particular programming language's API wrapper is released. In the meanwhile, you can use these recommended HTTP request libraries in your application, or simply use [curl](https://stackoverflow.com/a/27442239/3586413) as in the below examples.

| Language   | Library                                                                |
| ---------- | ---------------------------------------------------------------------- |
| Ruby       | [Faraday](https://github.com/lostisland/faraday)                       |
| Python     | [requests](https://github.com/psf/requests)                            |
| Java       | [OkHttp](https://github.com/square/okhttp/)                            |
| PHP        | [guzzle](https://github.com/guzzle/guzzle)                             |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (we are maintainers) |
| Node.js    | [superagent](https://github.com/ladjs/superagent) (we are maintainers) |
| Go         | [net/http](https://golang.org/pkg/net/http/)                           |
| .NET       | [RestSharp](https://github.com/restsharp/RestSharp)                    |


## Base URI

The current HTTP base URI path is: `BASE_URI`.


## Authentication

All endpoints require authentication using [Basic Authorization](https://en.wikipedia.org/wiki/Basic_access_authentication). We support two authentication methods:

### API Token Authentication (Recommended for most endpoints)

Set your [API key](https://forwardemail.net/my-account/security) as the "username" value with an empty password:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

Note the colon (`:`) after the API token – this indicates an empty password in Basic Auth format.

### Alias Credentials Authentication (For outbound email)

The [Create outbound SMTP email](#create-outbound-smtp-email) endpoint also supports authentication using your alias email address and a [generated alias password](/faq#do-you-support-receiving-email-with-imap):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@yourdomain.com:your_generated_password" \
  -d "to=recipient@example.com" \
  -d "subject=Hello" \
  -d "text=Test email"
```

This method is useful when sending emails from applications that already use SMTP credentials and makes migration from SMTP to our API seamless.

### Alias-Only Endpoints

[Alias Contacts](#alias-contacts-carddav), [Alias Calendars](#alias-calendars-caldav), [Alias Messages](#alias-messages-imappop3), and [Alias Folders](#alias-folders-imappop3) endpoints require alias credentials and do not support API token authentication.

Don't worry – examples are provided below for you if you're not sure what this is.


## Errors

If any errors occur, the response body of the API request will contain a detailed error message.

| Code | Name                  |
| ---- | --------------------- |
| 200  | OK                    |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 429  | Too Many Requests     |
| 500  | Internal Server Error |
| 501  | Not Implemented       |
| 502  | Bad Gateway           |
| 503  | Service Unavailable   |
| 504  | Gateway Time-out      |

> \[!TIP]
> If you receive a 5xx status code (which should not happen), then please contact us at <a href="mailto:api@forwardemail.net"><api@forwardemail.net></a> and we will help you to resolve your issue immediately.


## Localization

Our service is translated to over 25 different languages. All API response messages are translated to the last locale detected of the user making the API request. You can override this by passing a custom `Accept-Language` header. Feel free to try it out using the language drop-down at the bottom of this page.


## Pagination

> \[!NOTE]
> As of November 1st, 2024 the API endpoints for [List domains](#list-domains) and [List domain aliases](#list-domain-aliases) will default to `1000` max results per page.  If you would like to opt-in to this behavior early, you can pass `?paginate=true` as an additional querystring parameter to the URL for the endpoint query.

Pagination is supported by all API endpoints that list results.

Simply provide the querystring properties `page` (and optionally `limit`).

The property `page` should be a number greater than or equal to `1`.  If you provide `limit` (also a number), then the minimum value is `10` and maximum is `50` (unless otherwise noted).

| Querystring Parameter | Required | Type   | Description                                                                                                                                               |
| --------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page`                | No       | Number | Page of results to return.  If not specified, the `page` value will be `1`.  Must be a number greater than or equal to `1`.                               |
| `limit`               | No       | Number | Number of results to return per page.  Defaults to `10` if not specified.  Must be a number greater than or equal to `1`, and less than or equal to `50`. |

In order to determine whether or not more results are available, we provide these HTTP response headers (which you can parse in order to paginate programmatically):

| HTTP Response Header | Example                                                                                                                                                                                                                                                  | Description                                                                                                                                                                                                                                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count`       | `X-Page-Count: 3`                                                                                                                                                                                                                                        | The total page count available.                                                                                                                                                                                                                                                                                                                                    |
| `X-Page-Current`     | `X-Page-Current: 1`                                                                                                                                                                                                                                      | The current page of results returned (e.g. based off `page` querystring parameter).                                                                                                                                                                                                                                                                                |
| `X-Page-Size`        | `X-Page-Size: 10`                                                                                                                                                                                                                                        | The total number of results in the page returned (e.g. based off `limit` querystring parameter and actual results returned).                                                                                                                                                                                                                                       |
| `X-Item-Count`       | `X-Item-Count: 30`                                                                                                                                                                                                                                       | The total number of items available across all pages.                                                                                                                                                                                                                                                                                                              |
| `Link`               | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | We provide a `Link` HTTP response header you can parse as shown in the example. This is [similar to GitHub](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers) (e.g. not all values will be provided if they are not relevant or available, e.g. `"next"` will not be provided if there is not another page). |

> Example Request:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```


## Logs

### Retrieve logs

Our API programmatically allows you to download logs for your account.  Submitting a request to this endpoint will process all logs for your account and email them to you as an attachment ([Gzip](https://en.wikipedia.org/wiki/Gzip) compressed [CSV](https://en.wikipedia.org/wiki/Comma-separated_values) spreadsheet file) once complete.

This allows you to create background jobs with a [Cron job](https://en.wikipedia.org/wiki/Cron) or using our [Node.js job scheduling software Bree](https://github.com/breejs/bree) to receive logs whenever you desire.  Note that this endpoint is limited to `10` requests per day.

The attachment is the lowercase form of `email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz` and the email itself contains a brief summary of the logs retrieved.  You can also download logs at any time from [My Account → Logs](/my-account/logs)

> `GET /v1/logs/download`

| Querystring Parameter | Required | Type          | Description                                                                                                                     |
| --------------------- | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `domain`              | No       | String (FQDN) | Filter logs by fully qualified domain ("FQDN").  If you do not provide this then all logs across all domains will be retrieved. |
| `q`                   | No       | String        | Search for logs by email, domain, alias name, IP address, or date (`M/Y`, `M/D/YY`, `M-D`, `M-D-YY`, or `M.D.YY` format).       |
| `bounce_category`     | No       | String        | Search for logs by a specific bounce category (e.g. `blocklist`).                                                               |
| `response_code`       | No       | Number        | Search for logs by a specific error response code (e.g. `421` or `550`).                                                        |

> Example Request:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Example Cron job (at midnight every day):

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Note that you can use services such as [Crontab.guru](https://crontab.guru/) to validate your cron job expression syntax.

> Example Cron job (at midnight every day **and with logs for previous day**):

For MacOS:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

For Linux and Ubuntu:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```


## Account

### Create account

> `POST /v1/account`

| Body Parameter | Required | Type           | Description   |
| -------------- | -------- | -------------- | ------------- |
| `email`        | Yes      | String (Email) | Email address |
| `password`     | Yes      | String         | Password      |

> Example Request:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### Retrieve account

> `GET /v1/account`

> Example Request:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### Update account

> `PUT /v1/account`

| Body Parameter | Required | Type           | Description          |
| -------------- | -------- | -------------- | -------------------- |
| `email`        | No       | String (Email) | Email address        |
| `given_name`   | No       | String         | First name           |
| `family_name`  | No       | String         | Last name            |
| `avatar_url`   | No       | String (URL)   | Link to avatar image |

> Example Request:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```


## Alias Contacts (CardDAV)

> \[!NOTE]
> Unlike other API endpoints, these require [Authentication](#authentication) "username" equal to the alias username and "password" equal to the alias generated password as Basic Authorization headers.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

### List contacts

> `GET /v1/contacts`

**Coming soon**

### Create contact

> `POST /v1/contacts`

**Coming soon**

### Retrieve contact

> `GET /v1/contacts/:id`

**Coming soon**

### Update contact

> `PUT /v1/contacts/:id`

**Coming soon**

### Delete contact

> `DELETE /v1/contacts/:id`

**Coming soon**


## Alias Calendars (CalDAV)

> \[!NOTE]
> Unlike other API endpoints, these require [Authentication](#authentication) "username" equal to the alias username and "password" equal to the alias generated password as Basic Authorization headers.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

### List calendars

> `GET /v1/calendars`

**Coming soon**

### Create calendar

> `POST /v1/calendars`

**Coming soon**

### Retrieve calendar

> `GET /v1/calendars/:id`

**Coming soon**

### Update calendar

> `PUT /v1/calendars/:id`

**Coming soon**

### Delete calendar

> `DELETE /v1/calendars/:id`

**Coming soon**


## Alias Messages (IMAP/POP3)

> \[!NOTE]
> Unlike other API endpoints, these require [Authentication](#authentication) "username" equal to the alias username and "password" equal to the alias generated password as Basic Authorization headers.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

Please ensure that you have followed setup instructions for your domain.

These instructions can be found in our FAQ section [Do you support receiving email with IMAP?](/faq#do-you-support-receiving-email-with-imap).

### List and search for messages

> `GET /v1/messages`

**Coming soon**

### Create message

> \[!NOTE]
> This will **NOT** send an email – it will only simply add the message to your mailbox folder (e.g. this is similar to the IMAP `APPEND` command).  If you would like to send an email, then see [Create outbound SMTP email](#create-outbound-smtp-email) below.  After creating the outbound SMTP email, then you can append a copy of it using this endpoint to your alias' mailbox for storage purposes.

> `POST /v1/messages`

**Coming soon**

### Retrieve message

> `GET /v1/messages/:id`

**Coming soon**

### Update message

> `PUT /v1/messages/:id`

**Coming soon**

### Delete message

> `DELETE /v1/messages:id`

**Coming soon**


## Alias Folders (IMAP/POP3)

> \[!TIP]
> Folder endpoints with a folder's path <code>/v1/folders/:path</code> as their endpoint are interchangeable with a folder's ID <code>:id</code>. This means you can refer to the folder by either its <code>path</code> or <code>id</code> value.

> \[!WARNING]
> This endpoint section is a work in progress and will be released (hopefully) in 2024.  In the interim please use an IMAP client from the "Apps" dropdown in the navigation of our website.

### List folders

> `GET /v1/folders`

**Coming soon**

### Create folder

> `POST /v1/folders`

**Coming soon**

### Retrieve folder

> `GET /v1/folders/:id`

**Coming soon**

### Update folder

> `PUT /v1/folders/:id`

**Coming soon**

### Delete folder

> `DELETE /v1/folders/:id`

**Coming soon**

### Copy folder

> `POST /v1/folders/:id/copy`

**Coming soon**


## Outbound Emails

Please ensure that you have followed setup instructions for your domain.

These instructions can be found at [My Account → Domains → Settings → Outbound SMTP Configuration](/my-account/domains).  You need to ensure setup of DKIM, Return-Path, and DMARC for sending outbound SMTP with your domain.

### Get outbound SMTP email limit

This is a simple endpoint that returns a JSON object containing the `count` and `limit` for the number of daily SMTP outbound messages on a per account basis.

> `GET /v1/emails/limit`

> Example Request:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### List outbound SMTP emails

Note that this endpoint does not return property values for an email's `message`, `headers`, nor `rejectedErrors`.

To return those properties and their values, please use the [Retrieve email](#retrieve-email) endpoint with an email ID.

> `GET /v1/emails`

| Querystring Parameter | Required | Type                      | Description                                                                                                                                      |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | No       | String (RegExp supported) | Search for emails by metadata                                                                                                                    |
| `domain`              | No       | String (RegExp supported) | Search for emails by domain name                                                                                                                 |
| `sort`                | No       | String                    | Sort by a specific field (prefix with a single hyphen `-` to sort in the reverse direction of that field).  Defaults to `created_at` if not set. |
| `page`                | No       | Number                    | See [Pagination](#pagination) for more insight                                                                                                   |
| `limit`               | No       | Number                    | See [Pagination](#pagination) for more insight                                                                                                   |

> Example Request:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### Create outbound SMTP email

Our API for creating an email is inspired by and leverages Nodemailer's message option configuration.  Please defer to the [Nodemailer message configuration](https://nodemailer.com/message/) for all body parameters below.

Note that with the exception of `envelope` and `dkim` (since we set those automatically for you), we support all Nodemailer options.  We automatically set `disableFileAccess` and `disableUrlAccess` options to `true` for security purposes.

You should either pass the single option of `raw` with your raw full email including headers **or** pass individual body parameter options below.

This API endpoint will automatically encode emojis for you if they are found in the headers (e.g. a subject line of `Subject: 🤓 Hello` gets converted to `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello` automatically).  Our goal was to make an extremely developer-friendly and dummy-proof email API.

**Authentication:** This endpoint supports both [API token authentication](#api-token-authentication-recommended-for-most-endpoints) and [alias credentials authentication](#alias-credentials-authentication-for-outbound-email). See the [Authentication](#authentication) section above for details.

> `POST /v1/emails`

| Body Parameter   | Required | Type             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---------------- | -------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`           | No       | String (Email)   | The email address of the sender (must exist as an alias of the domain).                                                                                                                                                                                                                                                                                                                                                                                          |
| `to`             | No       | String or Array  | Comma separated list or an Array of recipients for the "To" header.                                                                                                                                                                                                                                                                                                                                                                                              |
| `cc`             | No       | String or Array  | Comma separated list or an Array of recipients for the "Cc" header.                                                                                                                                                                                                                                                                                                                                                                                              |
| `bcc`            | No       | String or Array  | Comma separated list or an Array of recipients for the "Bcc" header.                                                                                                                                                                                                                                                                                                                                                                                             |
| `subject`        | No       | String           | The subject of the email.                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `text`           | No       | String or Buffer | The plaintext version of the message.                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `html`           | No       | String or Buffer | The HTML version of the message.                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `attachments`    | No       | Array            | An array of attachment objects (see [Nodemailer's common fields](https://nodemailer.com/message/#common-fields)).                                                                                                                                                                                                                                                                                                                                                |
| `sender`         | No       | String           | The email address for the "Sender" header (see [Nodemailer's more advanced fields](https://nodemailer.com/message/#more-advanced-fields)).                                                                                                                                                                                                                                                                                                                       |
| `replyTo`        | No       | String           | The email address for the "Reply-To" header.                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `inReplyTo`      | No       | String           | The Message-ID the message is in reply to.                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `references`     | No       | String or Array  | Space separated list or an Array of Message-ID's.                                                                                                                                                                                                                                                                                                                                                                                                                |
| `attachDataUrls` | No       | Boolean          | If `true` then converts `data:` images in the HTML content of the message to embedded attachments.                                                                                                                                                                                                                                                                                                                                                               |
| `watchHtml`      | No       | String           | An Apple Watch specific HTML version of the message ([according to the Nodemailer docs](https://nodemailer.com/message/#content-options]), the latest watches do not require this to be set).                                                                                                                                                                                                                                                                    |
| `amp`            | No       | String           | An AMP4EMAIL specific HTML version of the message (see [Nodemailer's example](https://nodemailer.com/message/#amp-example)).                                                                                                                                                                                                                                                                                                                                     |
| `icalEvent`      | No       | Object           | An iCalendar event to use as an alternative message content (see [Nodemailer's calendar events](https://nodemailer.com/message/calendar-events/)).                                                                                                                                                                                                                                                                                                               |
| `alternatives`   | No       | Array            | An Array of alternative message content (see [Nodemailer's alternative content](https://nodemailer.com/message/alternatives/)).                                                                                                                                                                                                                                                                                                                                  |
| `encoding`       | No       | String           | Encoding for the text and HTML strings (defaults to `"utf-8"`, but supports `"hex"` and `"base64"` encoding values as well).                                                                                                                                                                                                                                                                                                                                     |
| `raw`            | No       | String or Buffer | A custom generated RFC822 formatted message to use (instead of one that is generated by Nodemailer – see [Nodemailer's custom source](https://nodemailer.com/message/custom-source/)).                                                                                                                                                                                                                                                                           |
| `textEncoding`   | No       | String           | Encoding that is forced to be used for text values (either `"quoted-printable"` or `"base64"`).  The default value is the closest value detected (for ASCII use `"quoted-printable"`).                                                                                                                                                                                                                                                                           |
| `priority`       | No       | String           | Priority level for the email (can either be `"high"`, `"normal"` (default), or `"low"`).  Note that a value of `"normal"` does not set a priority header (this is the default behavior).  If a value of `"high"` or `"low"` is set, then the `X-Priority`, `X-MSMail-Priority`, and `Importance` headers [will be set accordingly](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240). |
| `headers`        | No       | Object or Array  | An Object or an Array of additional header fields to set (see [Nodemailer's custom headers](https://nodemailer.com/message/custom-headers/)).                                                                                                                                                                                                                                                                                                                    |
| `messageId`      | No       | String           | An optional Message-ID value for the "Message-ID" header (a default value will be automatically created if not set – note that the value should [adhere to the RFC2822 specification](https://stackoverflow.com/a/4031705)).                                                                                                                                                                                                                                     |
| `date`           | No       | String or Date   | An optional Date value that will be used if the Date header is missing after parsing, otherwise the current UTC string will be used if not set.  The date header cannot be more than 30 days in advance of the current time.                                                                                                                                                                                                                                     |
| `list`           | No       | Object           | An optional Object of `List-*` headers (see [Nodemailer's list headers](https://nodemailer.com/message/list-headers/)).                                                                                                                                                                                                                                                                                                                                          |

> Example Request (API Token):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Example Request (Alias Credentials):

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@DOMAIN_NAME:GENERATED_PASSWORD" \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> Example Request (Raw Email):

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### Retrieve outbound SMTP email

> `GET /v1/emails/:id`

> Example Request:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### Delete outbound SMTP email

Email deletion will set the status to `"rejected"` (and subsequently not process it in the queue) if and only if the current status is one of `"pending"`, `"queued"`, or `"deferred"`.  We may purge emails automatically after 30 days after they were created and/or sent – therefore you should keep a copy of outbound SMTP emails in your client, database, or application.  You can reference our email ID value in your database if desired – this value is returned from both [Create email](#create-email) and [Retrieve email](#retrieve-email) endpoints.

> `DELETE /v1/emails/:id`

> Example Request:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```


## Domains

> \[!TIP]
> Domain endpoints with a domain's name <code>/v1/domains/:domain\_name</code> as their endpoint are interchangeable with a domain's ID <code>:domain\_id</code>. This means you can refer to the domain by either its <code>name</code> or <code>id</code> value.

### List domains

> \[!NOTE]
> As of November 1st, 2024 the API endpoints for [List domains](#list-domains) and [List domain aliases](#list-domain-aliases) will default to `1000` max results per page.  If you would like to opt-in to this behavior early, you can pass `?paginate=true` as an additional querystring parameter to the URL for the endpoint query.  See [Pagination](#pagination) for more insight.

> `GET /v1/domains`

| Querystring Parameter | Required | Type                      | Description                                                                                                                                      |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | No       | String (RegExp supported) | Search for domains by name                                                                                                                       |
| `name`                | No       | String (RegExp supported) | Search for domains by name                                                                                                                       |
| `sort`                | No       | String                    | Sort by a specific field (prefix with a single hyphen `-` to sort in the reverse direction of that field).  Defaults to `created_at` if not set. |
| `page`                | No       | Number                    | See [Pagination](#pagination) for more insight                                                                                                   |
| `limit`               | No       | Number                    | See [Pagination](#pagination) for more insight                                                                                                   |

> Example Request:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Create domain

> `POST /v1/domains`

| Body Parameter                 | Required | Type                                          | Description                                                                                                                                                                                                                                                                                                          |
| ------------------------------ | -------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain`                       | Yes      | String (FQDN or IP)                           | Fully qualified domain name ("FQDN") or IP address                                                                                                                                                                                                                                                                   |
| `team_domain`                  | No       | String (domain ID or domain name; FQDN)       | Automatically assign this domain to the same team from another domain.  This means that all members from this domain will be assigned as team members, and the `plan` will automatically be set to `team` as well.  You can set this to `"none"` if necessary to explicitly disable this, but that is not necessary. |
| `plan`                         | No       | String (enumerable)                           | Plan type (must be `"free"`, `"enhanced_protection"`, or `"team"`, defaults to `"free"` or the user's current paid plan if on one)                                                                                                                                                                                   |
| `catchall`                     | No       | String (delimited email addresses) or Boolean | Create a default catch-all alias, defaults to `true` (if `true` it will use the API user's email address as a recipient, and if `false` no catch-all will be created). If a String is passed, then it is a delimited list of email addresses to use as recipients (separated by line break, space, and/or comma)     |
| `has_adult_content_protection` | No       | Boolean                                       | Whether to enable Spam Scanner adult content protection on this domain                                                                                                                                                                                                                                               |
| `has_phishing_protection`      | No       | Boolean                                       | Whether to enable Spam Scanner phishing protection on this domain                                                                                                                                                                                                                                                    |
| `has_executable_protection`    | No       | Boolean                                       | Whether to enable Spam Scanner executable protection on this domain                                                                                                                                                                                                                                                  |
| `has_virus_protection`         | No       | Boolean                                       | Whether to enable Spam Scanner virus protection on this domain                                                                                                                                                                                                                                                       |
| `has_recipient_verification`   | No       | Boolean                                       | Global domain default for whether to require alias recipients to click an email verification link for emails to flow through                                                                                                                                                                                         |
| `ignore_mx_check`              | No       | Boolean                                       | Whether to ignore the MX record check on the domain for verification.  This is mainly for users that have advanced MX exchange configuration rules and need to keep their existing MX exchange and forward to ours.                                                                                                  |
| `retention_days`               | No       | Number                                        | Integer between `0` and `30` that corresponds to the number of retention days to store outbound SMTP emails once successfully delivered or permanently errored.  Defaults to `0`, which means that outbound SMTP emails are purged and redacted immediately for your security.                                       |
| `bounce_webhook`               | No       | String (URL) or Boolean (false)               | The `http://` or `https://` webhook URL of your choice to send bounce webhooks to.  We will submit a `POST` request to this URL with information on outbound SMTP failures (e.g. soft or hard failures – so you can manage your subscribers and programmatically manage your outbound email).                        |
| `max_quota_per_alias`          | No       | String                                        | Storage maximum quota for aliases on this domain name.  Enter a value such as "1 GB" that will be parsed by [bytes](https://github.com/visionmedia/bytes.js).                                                                                                                                                        |

> Example Request:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### Retrieve domain

> `GET /v1/domains/DOMAIN_NAME`

> Example Request:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Verify domain records

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Example Request:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Verify domain SMTP records

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Example Request:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### List domain-wide catch-all passwords

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Example Request:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Create domain-wide catch-all password

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Body Parameter | Required | Type   | Description                                                                                                                                                                                                               |
| -------------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password` | No       | String | Your custom new password to use for the domain-wide catch-all password.  Note that you can leave this blank or missing altogether from your API request body if you wish to get a randomly generated and strong password. |
| `description`  | No       | String | Description for organization purposes only.                                                                                                                                                                               |

> Example Request:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### Remove domain-wide catch-all password

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Example Request:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### Update domain

> `PUT /v1/domains/DOMAIN_NAME`

| Body Parameter                 | Required | Type                            | Description                                                                                                                                                                                                                                                                                   |
| ------------------------------ | -------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port`                    | No       | String or Number                | Custom port to configure for SMTP forwarding (default is `"25"`)                                                                                                                                                                                                                              |
| `has_adult_content_protection` | No       | Boolean                         | Whether to enable Spam Scanner adult content protection on this domain                                                                                                                                                                                                                        |
| `has_phishing_protection`      | No       | Boolean                         | Whether to enable Spam Scanner phishing protection on this domain                                                                                                                                                                                                                             |
| `has_executable_protection`    | No       | Boolean                         | Whether to enable Spam Scanner executable protection on this domain                                                                                                                                                                                                                           |
| `has_virus_protection`         | No       | Boolean                         | Whether to enable Spam Scanner virus protection on this domain                                                                                                                                                                                                                                |
| `has_recipient_verification`   | No       | Boolean                         | Global domain default for whether to require alias recipients to click an email verification link for emails to flow through                                                                                                                                                                  |
| `ignore_mx_check`              | No       | Boolean                         | Whether to ignore the MX record check on the domain for verification.  This is mainly for users that have advanced MX exchange configuration rules and need to keep their existing MX exchange and forward to ours.                                                                           |
| `retention_days`               | No       | Number                          | Integer between `0` and `30` that corresponds to the number of retention days to store outbound SMTP emails once successfully delivered or permanently errored.  Defaults to `0`, which means that outbound SMTP emails are purged and redacted immediately for your security.                |
| `bounce_webhook`               | No       | String (URL) or Boolean (false) | The `http://` or `https://` webhook URL of your choice to send bounce webhooks to.  We will submit a `POST` request to this URL with information on outbound SMTP failures (e.g. soft or hard failures – so you can manage your subscribers and programmatically manage your outbound email). |
| `max_quota_per_alias`          | No       | String                          | Storage maximum quota for aliases on this domain name.  Enter a value such as "1 GB" that will be parsed by [bytes](https://github.com/visionmedia/bytes.js).                                                                                                                                 |

> Example Request:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Delete domain

> `DELETE /v1/domains/:domain_name`

> Example Request:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```


## Invites

### Accept domain invite

> `GET /v1/domains/:domain_name/invites`

> Example Request:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### Create domain invite

> `POST /v1/domains/DOMAIN_NAME/invites`

| Body Parameter | Required | Type                | Description                                                                               |
| -------------- | -------- | ------------------- | ----------------------------------------------------------------------------------------- |
| `email`        | Yes      | String (Email)      | Email address to invite to domain members list                                            |
| `group`        | Yes      | String (enumerable) | Group to add the user to the domain membership with (can be one of `"admin"` or `"user"`) |

> Example Request:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> If the user being invited is already an accepted member of any other domains the admin inviting them is a member of, then it will auto-accept the invite and not send an email.

### Remove domain invite

> `DELETE /v1/domains/:domain_name/invites`

| Body Parameter | Required | Type           | Description                                      |
| -------------- | -------- | -------------- | ------------------------------------------------ |
| `email`        | Yes      | String (Email) | Email address to remove from domain members list |

> Example Request:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```


## Members

### Update domain member

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Body Parameter | Required | Type                | Description                                                                                  |
| -------------- | -------- | ------------------- | -------------------------------------------------------------------------------------------- |
| `group`        | Yes      | String (enumerable) | Group to update the user to the domain membership with (can be one of `"admin"` or `"user"`) |

> Example Request:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### Remove domain member

> `DELETE /v1/domains/:domain_name/members/:member_id`

> Example Request:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```


## Aliases

### Generate an alias password

Note that if you do not email instructions, then the username and password will be in the JSON response body of a successful request in the format `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }`.

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Body Parameter         | Required | Type    | Description                                                                                                                                                                                                                                                                                         |
| ---------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new_password`         | No       | String  | Your custom new password to use for the alias.  Note that you can leave this blank or missing altogether from your API request body if you wish to get a randomly generated and strong password.                                                                                                    |
| `password`             | No       | String  | Existing password for alias to change the password without deleting the existing IMAP mailbox storage (see `is_override` option below if you no longer have the existing password).                                                                                                                 |
| `is_override`          | No       | Boolean | **USE WITH CAUTION**: This will override the existing alias password and database completely, and will permanently delete the existing IMAP storage and reset the alias' SQLite email database completely. Please make a backup if possible if you have an existing mailbox attached to this alias. |
| `emailed_instructions` | No       | String  | Email address to send the alias' password and setup instructions to.                                                                                                                                                                                                                                |

> Example Request:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### List domain aliases

> \[!NOTE]
> As of November 1st, 2024 the API endpoints for [List domains](#list-domains) and [List domain aliases](#list-domain-aliases) will default to `1000` max results per page.  If you would like to opt-in to this behavior early, you can pass `?paginate=true` as an additional querystring parameter to the URL for the endpoint query.  See [Pagination](#pagination) for more insight.

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Querystring Parameter | Required | Type                      | Description                                                                                                                                      |
| --------------------- | -------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | No       | String (RegExp supported) | Search for aliases in a domain by name, label, or recipient                                                                                      |
| `name`                | No       | String (RegExp supported) | Search for aliases in a domain by name                                                                                                           |
| `recipient`           | No       | String (RegExp supported) | Search for aliases in a domain by recipient                                                                                                      |
| `sort`                | No       | String                    | Sort by a specific field (prefix with a single hyphen `-` to sort in the reverse direction of that field).  Defaults to `created_at` if not set. |
| `page`                | No       | Number                    | See [Pagination](#pagination) for more insight                                                                                                   |
| `limit`               | No       | Number                    | See [Pagination](#pagination) for more insight                                                                                                   |

> Example Request:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### Create new domain alias

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Body Parameter                  | Required | Type                                   | Description                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | No       | String                                 | Alias name (if not provided or if blank, then a random alias is generated)                                                                                                                                                                                                                                                                                                                  |
| `recipients`                    | No       | String or Array                        | List of recipients (must be line-break/space/comma separated String or Array of valid email addresses, fully-qualified domain names ("FQDN"), IP addresses, and/or webhook URL's – and if not provided or is an empty Array, then the user's email making the API request will be set as the recipient)                                                                                     |
| `description`                   | No       | String                                 | Alias description                                                                                                                                                                                                                                                                                                                                                                           |
| `labels`                        | No       | String or Array                        | List of labels (must be line-break/space/comma separated String or Array)                                                                                                                                                                                                                                                                                                                   |
| `has_recipient_verification`    | No       | Boolean                                | Require recipients to click an email verification link for emails to flow through (defaults to the domain's setting if not explicitly set in the request body)                                                                                                                                                                                                                              |
| `is_enabled`                    | No       | Boolean                                | Whether to enable or disable this alias (if disabled, emails will be routed nowhere but return successful status codes). If a value is passed, it is converted to a boolean using [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                                                           |
| `error_code_if_disabled`        | No       | Number (either `250`, `421`, or `550`) | Incoming email to this alias will reject if `is_enabled` is `false` with either `250` (quietly deliver nowhere, e.g. blackhole or `/dev/null`), `421` (soft reject; and retry for up to ~5 days) or `550` permanent failure and rejection. Defaults to `250`.                                                                                                                               |
| `has_imap`                      | No       | Boolean                                | Whether to enable or disable IMAP storage for this alias (if disabled, then inbound emails received will not get stored to [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service).  If a value is passed, it is converted to a boolean using [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                  |
| `has_pgp`                       | No       | Boolean                                | Whether to enable or disable [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) for [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) using the alias' `public_key`.                                                                                                         |
| `public_key`                    | No       | String                                 | OpenPGP public key in ASCII Armor format ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); e.g. GPG key for `support@forwardemail.net`). This only applies if you have `has_pgp` set to `true`. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                     | No       | String                                 | Storage maximum quota for this alias. Leave blank to reset to domain current maximum quota or enter a value such as "1 GB" that will be parsed by [bytes](https://github.com/visionmedia/bytes.js).  This value can only be adjusted by domain admins.                                                                                                                                      |
| `vacation_responder_is_enabled` | No       | Boolean                                | Whether to enable or disable an automatic vacation responder.                                                                                                                                                                                                                                                                                                                               |
| `vacation_responder_start_date` | No       | String                                 | Start date for vacation responder (if enabled and no start date set here, then it assumes it is already started).  We support date formats such as `MM/DD/YYYY`, `YYYY-MM-DD`, and other date formats via smart parsing using `dayjs`.                                                                                                                                                      |
| `vacation_responder_end_date`   | No       | String                                 | End date for vacation responder (if enabled and no end date set here, then it assumes it never ends and responds forever).   We support date formats such as `MM/DD/YYYY`, `YYYY-MM-DD`, and other date formats via smart parsing using `dayjs`.                                                                                                                                            |
| `vacation_responder_subject`    | No       | String                                 | Subject in plaintext for the vacation responder, e.g. "Out of Office".  We use `striptags` to remove all HTML here.                                                                                                                                                                                                                                                                         |
| `vacation_responder_message`    | No       | String                                 | Message in plaintext for the vacation responder, e.g. "I will be out of office until February.".  We use `striptags` to remove all HTML here.                                                                                                                                                                                                                                               |

> Example Request:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Retrieve domain alias

You can retrieve a domain alias by either its `id` or its `name` value.

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> Example Request:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> Example Request:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### Update domain alias

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Body Parameter                  | Required | Type                                   | Description                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | No       | String                                 | Alias name                                                                                                                                                                                                                                                                                                                                                                                  |
| `recipients`                    | No       | String or Array                        | List of recipients (must be line-break/space/comma separated String or Array of valid email addresses, fully-qualified domain names ("FQDN"), IP addresses, and/or webhook URL's)                                                                                                                                                                                                           |
| `description`                   | No       | String                                 | Alias description                                                                                                                                                                                                                                                                                                                                                                           |
| `labels`                        | No       | String or Array                        | List of labels (must be line-break/space/comma separated String or Array)                                                                                                                                                                                                                                                                                                                   |
| `has_recipient_verification`    | No       | Boolean                                | Require recipients to click an email verification link for emails to flow through (defaults to the domain's setting if not explicitly set in the request body)                                                                                                                                                                                                                              |
| `is_enabled`                    | No       | Boolean                                | Whether to enable or disable this alias (if disabled, emails will be routed nowhere but return successful status codes). If a value is passed, it is converted to a boolean using [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                                                                                           |
| `error_code_if_disabled`        | No       | Number (either `250`, `421`, or `550`) | Incoming email to this alias will reject if `is_enabled` is `false` with either `250` (quietly deliver nowhere, e.g. blackhole or `/dev/null`), `421` (soft reject; and retry for up to ~5 days) or `550` permanent failure and rejection. Defaults to `250`.                                                                                                                               |
| `has_imap`                      | No       | Boolean                                | Whether to enable or disable IMAP storage for this alias (if disabled, then inbound emails received will not get stored to [IMAP storage](/blog/docs/best-quantum-safe-encrypted-email-service).  If a value is passed, it is converted to a boolean using [boolean](https://github.com/thenativeweb/boolean#quick-start))                                                                  |
| `has_pgp`                       | No       | Boolean                                | Whether to enable or disable [OpenPGP encryption](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd) for [IMAP/POP3/CalDAV/CardDAV encrypted email storage](/blog/docs/best-quantum-safe-encrypted-email-service) using the alias' `public_key`.                                                                                                         |
| `public_key`                    | No       | String                                 | OpenPGP public key in ASCII Armor format ([click here to view an example](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt); e.g. GPG key for `support@forwardemail.net`). This only applies if you have `has_pgp` set to `true`. [Learn more about end-to-end encryption in our FAQ](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd). |
| `max_quota`                     | No       | String                                 | Storage maximum quota for this alias. Leave blank to reset to domain current maximum quota or enter a value such as "1 GB" that will be parsed by [bytes](https://github.com/visionmedia/bytes.js).  This value can only be adjusted by domain admins.                                                                                                                                      |
| `vacation_responder_is_enabled` | No       | Boolean                                | Whether to enable or disable an automatic vacation responder.                                                                                                                                                                                                                                                                                                                               |
| `vacation_responder_start_date` | No       | String                                 | Start date for vacation responder (if enabled and no start date set here, then it assumes it is already started).  We support date formats such as `MM/DD/YYYY`, `YYYY-MM-DD`, and other date formats via smart parsing using `dayjs`.                                                                                                                                                      |
| `vacation_responder_end_date`   | No       | String                                 | End date for vacation responder (if enabled and no end date set here, then it assumes it never ends and responds forever).   We support date formats such as `MM/DD/YYYY`, `YYYY-MM-DD`, and other date formats via smart parsing using `dayjs`.                                                                                                                                            |
| `vacation_responder_subject`    | No       | String                                 | Subject in plaintext for the vacation responder, e.g. "Out of Office".  We use `striptags` to remove all HTML here.                                                                                                                                                                                                                                                                         |
| `vacation_responder_message`    | No       | String                                 | Message in plaintext for the vacation responder, e.g. "I will be out of office until February.".  We use `striptags` to remove all HTML here.                                                                                                                                                                                                                                               |

> Example Request:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### Delete domain alias

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> Example Request:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```


## Encrypt

We allow you to encrypt records even on the free plan at no cost.  Privacy should not be a feature, it should be inherently built-in to all aspects of a product.  As highly requested in a [Privacy Guides discussion](https://discuss.privacyguides.net/t/forward-email-email-provider/13370) and on [our GitHub issues](https://github.com/forwardemail/forwardemail.net/issues/254) we've added this.

### Encrypt TXT Record

> `POST /v1/encrypt`

| Body Parameter | Required | Type   | Description                                  |
| -------------- | -------- | ------ | -------------------------------------------- |
| `input`        | Yes      | String | Any valid Forward Email plaintext TXT record |

> Example Request:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
