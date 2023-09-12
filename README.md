So originally I was having Strapi run alongside this in another folder. I don't know exactly how a git submodule works yet, but I think we just run Strapi in a Docker container.

I think we maybe use
https://docs.strapi.io/dev-docs/installation/docker
with
https://market.strapi.io/plugins/strapi-plugin-rest-cache
and the configs for the rooms
also backed up to CockroachDB vis PostgreSQL https://docs.strapi.io/dev-docs/installation/docker#optional-docker-compose
