# API


## Table of Contents

* [Endpoints](#endpoints)
  * [Public](#public)
  * [Private](#private)
* [Wrappers](#wrappers)
  * [Libraries](#libraries)
  * [Alternatives](#alternatives)


## Endpoints

All endpoints below require an [API key](https://forwardemail.net/my-account/security) to be set as the username value of the request's [Basic Authorization](https://en.wikipedia.org/wiki/Basic_access_authentication) header.

Our current HTTP base URI path is: `https://forwardemail.net:4000` however it will soon change to `https://api.forwardemail.net` with backwards compatibility.

### Public

| Endpoint                                    | Method | Description                                  |
| ------------------------------------------- | ------ | -------------------------------------------- |
| `/v1/domains`                               | GET    | List all domains                             |
| `/v1/domains`                               | POST   | Create a new domain                          |
| `/v1/domains/:domain_id`                    | GET    | Retrieve a domain                            |
| `/v1/domains/:domain_id/verify-records`     | GET    | Verify records for a domain                  |
| `/v1/domains/:domain_id`                    | PUT    | Update a domain                              |
| `/v1/domains/:domain_id`                    | DELETE | Delete a domain                              |
| `/v1/domains/:domain_id/invites`            | GET    | Retrieves and accepts an invite for a domain |
| `/v1/domains/:domain_id/invites`            | POST   | Create a new invite for a domain             |
| `/v1/domains/:domain_id/invites`            | DELETE | Removes an invite for a domain               |
| `/v1/domains/:domain_id/members/:member_id` | PUT    | Updates a member for a domain                |
| `/v1/domains/:domain_id/members/:member_id` | DELETE | Removes a member for a domain                |
| `/v1/domains/:domain_id/aliases`            | GET    | Retrieve all aliases for a domain            |
| `/v1/domains/:domain_id/aliases`            | POST   | Create a new alias for a domain              |
| `/v1/domains/:domain_id/aliases/:alias_id`  | PUT    | Update an alias for a domain                 |
| `/v1/domains/:domain_id/aliases/:alias_id`  | DELETE | Delete an alias for a domain                 |

### Private

These endpoints are restricted for internal use only by Forward Email's [SMTP server](https://github.com/forwardemail/free-email-forwarding).

| Endpoint      | Method | Description                                   |
| ------------- | ------ | --------------------------------------------- |
| `/v1/lookup`  | GET    | List the DNS alias configuration for a domain |
| `/v1/port`    | GET    | Retrieves the SMTP port for a domain          |
| `/v1/account` | POST   | Create a new account                          |


## Wrappers

Our API wrappers let you make requests to our API [endpoints](#endpoints) much easier.

### Libraries

Right now we have not yet released any API wrappers, however we plan to do so in the near future.

Send an email to [api@forwardemail.net](mailto:api@forwardemail.net) if you would like to be notified when a particular programming language's API wrapper is released.

### Alternatives

You can use these recommended HTTP request libraries in your application, or simply use [curl](https://stackoverflow.com/a/27442239/3586413).

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
