FROM node:24 AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG TRAQ_CLIENT_ID
RUN npm run generate

FROM caddy:2.10.2-alpine AS production

COPY --from=builder /app/.output/public /usr/share/caddy

COPY Caddyfile /etc/caddy/Caddyfile

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
