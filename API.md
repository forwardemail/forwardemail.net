# API


## Table of Contents

* [On-boarding](#on-boarding)
* [API](#api)
* [Database](#database)
  * [Domains](#domains)
  * [Aliases](#aliases)
* [Contributors](#contributors)
* [License](#license)


## On-boarding

1. If no domain yet exists once signed in, then is prompted to add a new domain.
2. DNS lookup occurs to determine if domain is registered, if not, then share affiliate link
3. DNS lookup occurs to determine where current name servers are and if using a mail service
4. Based off DNS lookup, a guide is generated for the user to configure DNS
5. Aliases can be configured, added, removed, enabled, and disabled at any time


## API

| Endpoint                                   | Method | Description                                      |
| ------------------------------------------ | ------ | ------------------------------------------------ |
| `/v1/domains`                              | GET    | List all domains                                 |
| `/v1/domains`                              | POST   | Create a new domain                              |
| `/v1/domains/:domain_id`                   | GET    | Retrieve a domain by `domain_id`                 |
| `/v1/domains/:domain_id`                   | PUT    | Update a domain by `domain_id`                   |
| `/v1/domains/:domain_id`                   | DELETE | Delete a domain by `domain_id`                   |
| `/v1/domains/:domain_id/aliases`           | GET    | Retrieve all aliases for a domain by `domain_id` |
| `/v1/domains/:domain_id/aliases`           | POST   | Create a new alias                               |
| `/v1/domains/:domain_id/aliases/:alias_id` | GET    | Retrieve an alias by `domain_id` and `alias_id`  |
| `/v1/domains/:domain_id/aliases/:alias_id` | PUT    | Update an alias by `domain_id` and `alias_id`    |
| `/v1/domains/:domain_id/aliases/:alias_id` | DELETE | Delete an alias by `domain_id` and `alias_id`    |


## Database

### Domains

* `members` (Array) - contains an Array of Objects with `user` (ObjectID) and `group` (String, enumerable, must be "admin" or "user", defaults to "user", must have at least one Object and at least one admin)
* `name` (String) - either a host name or a mail exchanger name (must be IP or FQDN)

### Aliases

* `domain` (ObjectID) - reference to a domain (required)
* `user` (ObjectID) - reference to user that created this alias (required, note that admins of the domain can edit aliases created by any user, but normal users of the domain can only manage aliases they have created)
* `name` (String) - the username portion (defaults to `*` wildcard) (must be valid email when combined with domain)
* `recipients` (Array) - contains an Array of Strings


## Contributors

| Name           | Website                    |
| -------------- | -------------------------- |
| **Nick Baugh** | <http://niftylettuce.com/> |


## License

[Business Source License 1.1](https://github.com/forwardemail/forwardemail.net/blob/master/LICENSE) © [Niftylettuce, LLC.](https://niftylettuce.com/)


## 
