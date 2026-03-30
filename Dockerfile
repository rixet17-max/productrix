FROM node:20-slim
WORKDIR /app
COPY artifacts/api-server/dist/index.cjs ./
ENV NODE_ENV=production
CMD ["node", "index.cjs"]
