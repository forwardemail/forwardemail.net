# API


## Table of Contents

* [On-boarding](#on-boarding)
* [API](#api-1)
* [Contributors](#contributors)
* [License](#license)


## On-boarding

1. If no domain yet exists once signed in, then is prompted to add a new domain.
2. DNS lookup occurs to determine if domain is registered, if not, then share affiliate link
3. DNS lookup occurs to determine where current name servers are and if using a mail service
4. Based off DNS lookup, a guide is generated for the user to configure DNS
5. Aliases can be configured, added, removed, enabled, and disabled at any time
6. If user upgrades to Enhanced Protection Plan, then aliases are automatically synced with live TXT records, and emails go out to admins warning them public TXT records exist


## API

| Endpoint                                   | Method | Description                                                                                                       |
| ------------------------------------------ | ------ | ----------------------------------------------------------------------------------------------------------------- |
| `/v1/lookup`                               | GET    | Retrieves aliases configured for an Enhanced Protection plan domain (by `?verification_record=value` querystring) |
| `/v1/domains`                              | GET    | List all domains                                                                                                  |
| `/v1/domains`                              | POST   | Create a new domain                                                                                               |
| `/v1/domains/:domain_id`                   | GET    | Retrieve a domain by `domain_id`                                                                                  |
| `/v1/domains/:domain_id`                   | PUT    | Update a domain by `domain_id`                                                                                    |
| `/v1/domains/:domain_id`                   | DELETE | Delete a domain by `domain_id`                                                                                    |
| `/v1/domains/:domain_id/aliases`           | GET    | Retrieve all aliases for a domain by `domain_id`                                                                  |
| `/v1/domains/:domain_id/aliases`           | POST   | Create a new alias                                                                                                |
| `/v1/domains/:domain_id/aliases/:alias_id` | PUT    | Update an alias by `domain_id` and `alias_id`                                                                     |
| `/v1/domains/:domain_id/aliases/:alias_id` | DELETE | Delete an alias by `domain_id` and `alias_id`                                                                     |


## Contributors

| Name           | Website                    |
| -------------- | -------------------------- |
| **Nick Baugh** | <http://niftylettuce.com/> |


## License

[Business Source License 1.1](https://github.com/forwardemail/forwardemail.net/blob/master/LICENSE) © [Niftylettuce, LLC.](https://niftylettuce.com/)


## 
