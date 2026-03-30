FROM node:20-slim
WORKDIR /app
COPY artifacts/api-server/dist/index.cjs ./
COPY artifacts/product-matrix/dist/public ./public
ENV NODE_ENV=production
CMD ["node", "index.cjs"]
