FROM node:20-alpine
WORKDIR /app
COPY artifacts/api-server/dist/index.cjs ./
ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "index.cjs"]
