FROM node:20-alpine

RUN npm install -g pnpm@10

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY tsconfig.base.json tsconfig.json ./
COPY lib/ ./lib/
COPY artifacts/api-server/ ./artifacts/api-server/

RUN pnpm install

RUN pnpm --filter @workspace/api-server run build

EXPOSE 8080

ENTRYPOINT ["node"]
CMD ["artifacts/api-server/dist/index.cjs"]
