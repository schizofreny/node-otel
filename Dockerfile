FROM docker.io/node:16-slim

RUN npm install -g pnpm

WORKDIR /tracing

COPY ["dist", "."]
COPY ["package.json", "pnpm-lock.yaml", "./"]

RUN pnpm install --prod --frozen-lockfile
