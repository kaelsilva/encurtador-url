FROM node:20.18.0-alpine3.20

WORKDIR /back-end/

ARG DB_PORT
ARG DB_PASSWORD
ARG DB_DATABASE
ARG JWT_KEY
ARG DB_USER
ARG DB_HOST
ARG BASE_URL
ARG NODE_ENV

ENV DB_PORT=$DB_PORT
ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_DATABASE=$DB_DATABASE
ENV JWT_KEY=$JWT_KEY
ENV DB_USER=$DB_USER
ENV DB_HOST=$DB_HOST
ENV BASE_URL=$BASE_URL
ENV NODE_ENV=$NODE_ENV

COPY ./package.json .
COPY ./package-lock.json .

RUN npm ci

COPY . .

RUN npm run build

EXPOSE $API_PORT

CMD ["sh", "-c", "npx typeorm migration:run -d ./dist/database/datasource.js && npm run start:prod"]
