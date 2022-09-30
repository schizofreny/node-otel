ARG NODE_VERSION
FROM docker.io/node:$NODE_VERSION

RUN npm install -g pnpm

WORKDIR /tracing

COPY ["dist", "."]
COPY ["package.json", "pnpm-lock.yaml", "./"]

RUN pnpm install --prod --frozen-lockfile
