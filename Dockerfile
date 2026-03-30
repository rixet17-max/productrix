FROM node:20-slim AS builder
RUN npm install -g pnpm@10
WORKDIR /app
COPY . .
RUN pnpm install --filter @workspace/api-server... --no-frozen-lockfile
RUN pnpm --filter @workspace/api-server run build

FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/artifacts/api-server/dist/index.cjs ./
ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "index.cjs"]
