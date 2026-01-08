# AGENTS.md for forwardemail.net

> This file outlines the policies for AI agents accessing content on forwardemail.net and its subdomains. We believe in an open and accessible web, and this document provides guidelines for agents to interact with our content responsibly.


## User-Agent

All AI agents developed by or working on behalf of Forward Email will use the following User-Agent string:

`ForwardEmail-Agent/1.0`

We encourage other AI agents to use a descriptive User-Agent string so we can better understand how our content is being used.


## Crawling

We welcome AI agents to crawl and index our content. To ensure a positive experience for all users, we request that agents adhere to the following guidelines:

* **Rate Limiting**: Please limit requests to a reasonable rate to avoid impacting server performance. We recommend a crawl-delay of at least 1 second between requests.
* **Disallowed Paths**: Please do not crawl or index the following paths:
  * `/login`
  * `/register`
  * `/my-account`
  * `/admin`
* **Allowed Paths**: All other paths are generally open for crawling, but we encourage agents to prioritize publicly accessible content and documentation.


## Sitemap

An XML sitemap is available at:

* <https://forwardemail.net/sitemap.xml>


## License

[(BUSL-1.1 AND MPL-2.0)](LICENSE.md) © [Forward Email LLC](https://forwardemail.net)


## Contact

If you have any questions or concerns about our agent policies, please contact us at <support@forwardemail.net>.
