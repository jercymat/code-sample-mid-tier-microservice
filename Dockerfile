FROM node:16.14.2-alpine3.14

WORKDIR /app
COPY . /app

EXPOSE 8080
USER node

ENTRYPOINT ["node","/app/dist/index.js"]