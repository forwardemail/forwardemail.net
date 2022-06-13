# Email Forwarding API


## Table of Contents

* [Libraries](#libraries)
* [Base URI](#base-uri)
* [Authentication](#authentication)
* [Errors](#errors)
* [Localization](#localization)
* [Pagination](#pagination)
* [Account](#account)
  * [Create account](#create-account)
  * [Retrieve account](#retrieve-account)
  * [Update account](#update-account)
* [Domains](#domains)
  * [List domains](#list-domains)
  * [Create domain](#create-domain)
  * [Retrieve domain](#retrieve-domain)
  * [Verify domain records](#verify-domain-records)
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
  * [List domain aliases](#list-domain-aliases)
  * [Create new domain alias](#create-new-domain-alias)
  * [Retrieve domain alias](#retrieve-domain-alias)
  * [Update domain alias](#update-domain-alias)
  * [Delete domain alias](#delete-domain-alias)


## Libraries

Right now we have not yet released any API wrappers, but we plan to do so in the near future. Send an email to <api@forwardemail.net> if you would like to be notified when a particular programming language's API wrapper is released. In the meanwhile, you can use these recommended HTTP request libraries in your application, or simply use [curl](https://stackoverflow.com/a/27442239/3586413) as in the below examples.

| Language   | Library                                                 |
| ---------- | ------------------------------------------------------- |
| Ruby       | [Faraday](https://github.com/lostisland/faraday)        |
| Python     | [requests](https://github.com/psf/requests)             |
| Java       | [OkHttp](https://github.com/square/okhttp/)             |
| PHP        | [guzzle](https://github.com/guzzle/guzzle)              |
| JavaScript | [superagent](https://github.com/visionmedia/superagent) |
| Node.js    | [superagent](https://github.com/visionmedia/superagent) |
| Go         | [net/http](https://golang.org/pkg/net/http/)            |
| .NET       | [RestSharp](https://github.com/restsharp/RestSharp)     |


## Base URI

The current HTTP base URI path is: `BASE_URI`. The legacy HTTP base URI path of `https://forwardemail.net:4000` is deprecated as of January 1, 2021.


## Authentication

All endpoints require your [API key](https://forwardemail.net/my-account/security) to be set as the "username" value of the request's [Basic Authorization](https://en.wikipedia.org/wiki/Basic_access_authentication) header. Don't worry – examples are provided below for you if you're not sure what this is.


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

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
    If you receive a 5xx status code (which should not happen), then please contact us at <a href="mailto:api@forwardemail.net">api@forwardemail.net</a> and we will help you to resolve your issue immediately.
  </span>
</div>


## Localization

Our service is translated to over 25 different languages. All API response messages are translated to the last locale detected of the user making the API request. You can override this by passing a custom `Accept-Language` header. Feel free to try it out using the language drop-down at the bottom of this page.


## Pagination

If you would like to be notified when pagination is available, then please email <api@forwardemail.net>.


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
curl -X GET BASE_URI/v1/account \
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


## Domains

<div class="alert my-3 alert-primary">
  <i class="fa fa-info-circle font-weight-bold"></i>
  <strong class="font-weight-bold">
    Tip:
  </strong>
  <span>
    Domain endpoints with a domain's name <code>/v1/domains/:domain_name</code> as their path are interchangeable with a domain's ID <code>:domain_id</code>. This means you can refer to the domain by either its <code>name</code> or <code>id</code> value.
  </span>
</div>

### List domains

> `GET /v1/domains`

| Querystring Parameter | Required | Type                      | Description                      |
| --------------------- | -------- | ------------------------- | -------------------------------- |
| `name`                | No       | String (RegExp supported) | Search for domains by name       |
| `alias`               | No       | String (RegExp supported) | Search for domains by alias name |
| `recipient`           | No       | String (RegExp supported) | Search for domains by recipient  |

> Example Request:

```sh
curl -X GET BASE_URI/v1/domains \
  -u API_TOKEN:
```

### Create domain

> `POST /v1/domains`

| Body Parameter                 | Required | Type                                          | Description                                                                                                                                                                                                                                                                                                      |
| ------------------------------ | -------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain`                       | Yes      | String (FQDN or IP)                           | Fully qualified domain name ("FQDN") or IP address                                                                                                                                                                                                                                                               |
| `plan`                         | No       | String (enumerable)                           | Plan type (must be `"free"`, `"enhanced_protection"`, or `"team"`, defaults to `"free"` or the user's current paid plan if on one)                                                                                                                                                                               |
| `catchall`                     | No       | String (delimited email addresses) or Boolean | Create a default catch-all alias, defaults to `true` (if `true` it will use the API user's email address as a recipient, and if `false` no catch-all will be created). If a String is passed, then it is a delimited list of email addresses to use as recipients (separated by line break, space, and/or comma) |
| `has_adult_content_protection` | No       | Boolean                                       | Whether to enable Spam Scanner adult content protection on this domain                                                                                                                                                                                                                                           |
| `has_phishing_protection`      | No       | Boolean                                       | Whether to enable Spam Scanner phishing protection on this domain                                                                                                                                                                                                                                                |
| `has_executable_protection`    | No       | Boolean                                       | Whether to enable Spam Scanner executable protection on this domain                                                                                                                                                                                                                                              |
| `has_virus_protection`         | No       | Boolean                                       | Whether to enable Spam Scanner virus protection on this domain                                                                                                                                                                                                                                                   |
| `has_recipient_verification`   | No       | Boolean                                       | Global domain default for whether to require alias recipients to click an email verification link for emails to flow through                                                                                                                                                                                     |

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
curl -X GET BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### Verify domain records

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Example Request:

```sh
curl -X GET BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### Update domain

> `PUT /v1/domains/DOMAIN_NAME`

| Body Parameter                 | Required | Type             | Description                                                                                                                  |
| ------------------------------ | -------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `smtp_port`                    | No       | String or Number | Custom port to configure for SMTP forwarding (default is `"25"`)                                                             |
| `has_adult_content_protection` | No       | Boolean          | Whether to enable Spam Scanner adult content protection on this domain                                                       |
| `has_phishing_protection`      | No       | Boolean          | Whether to enable Spam Scanner phishing protection on this domain                                                            |
| `has_executable_protection`    | No       | Boolean          | Whether to enable Spam Scanner executable protection on this domain                                                          |
| `has_virus_protection`         | No       | Boolean          | Whether to enable Spam Scanner virus protection on this domain                                                               |
| `has_recipient_verification`   | No       | Boolean          | Global domain default for whether to require alias recipients to click an email verification link for emails to flow through |

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
curl -X GET BASE_URI/v1/domains/:domain_name/invites \
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

### List domain aliases

> `GET /v1/domains/DOMAIN_NAME/aliases`

| Querystring Parameter | Required | Type                      | Description                                 |
| --------------------- | -------- | ------------------------- | ------------------------------------------- |
| `name`                | No       | String (RegExp supported) | Search for aliases in a domain by name      |
| `recipient`           | No       | String (RegExp supported) | Search for aliases in a domain by recipient |

> Example Request:

```sh
curl -X GET BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### Create new domain alias

> `POST /v1/domains/DOMAIN_NAME/aliases`

| Body Parameter               | Required | Type            | Description                                                                                                                                                                         |
| ---------------------------- | -------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                       | Yes      | String          | Alias name                                                                                                                                                                          |
| `recipients`                 | Yes      | String or Array | List of recipients (must be line-break/space/comma separated String or Array of valid email addresses, fully-qualified domain names ("FQDN"), IP addresses, and/or webhook URL's)   |
| `description`                | No       | String          | Alias description                                                                                                                                                                   |
| `labels`                     | No       | String or Array | List of labels (must be line-break/space/comma separated String or Array)                                                                                                           |
| `has_recipient_verification` | No       | Boolean         | Whether to enable to require recipients to click an email verification link for emails to flow through (defaults to the domain's setting if not explicitly set in the request body) |
| `is_enabled`                 | No       | Boolean         | Whether to enable to disable this alias (if disabled, emails will be routed nowhere but return successful status codes)                                                             |

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

| Body Parameter               | Required | Type            | Description                                                                                                                                                                         |
| ---------------------------- | -------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                       | No       | String          | Alias name                                                                                                                                                                          |
| `recipients`                 | Yes      | String or Array | List of recipients (must be line-break/space/comma separated String or Array of valid email addresses, fully-qualified domain names ("FQDN"), IP addresses, and/or webhook URL's)   |
| `description`                | No       | String          | Alias description                                                                                                                                                                   |
| `labels`                     | No       | String or Array | List of labels (must be line-break/space/comma separated String or Array)                                                                                                           |
| `has_recipient_verification` | No       | Boolean         | Whether to enable to require recipients to click an email verification link for emails to flow through (defaults to the domain's setting if not explicitly set in the request body) |
| `is_enabled`                 | No       | Boolean         | Whether to enable to disable this alias (if disabled, emails will be routed nowhere but return successful status codes)                                                             |

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
