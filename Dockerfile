FROM node:20-alpine
WORKDIR /app
COPY artifacts/api-server/dist/index.cjs ./index.cjs
EXPOSE 8080
ENTRYPOINT ["node"]
CMD ["index.cjs"]
