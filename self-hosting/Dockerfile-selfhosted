FROM node:20 AS builder

WORKDIR /app

ENV SELF_HOSTED=true

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

COPY package.json ./
RUN pnpm i

COPY . ./
ENV NODE_ENV=production
RUN pnpm run build

## build everything in the first stage and then
## leverage .dockerignore and 2nd stage to remove files
## from the built image that we don't want included
FROM node:20-slim

WORKDIR /app

ENV SELF_HOSTED=true

RUN apt update && apt install -y dnsutils netcat-traditional curl openssl && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# TODO: this needs to come from or sync with env file (e.g. SQLITE_TMPDIR)
RUN mkdir -p /mnt/sqlite_storage

COPY --from=builder /app /app