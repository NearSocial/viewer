FROM node:20.15-alpine as build
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

FROM socialengine/nginx-spa:latest
COPY --from=build /app/dist /app
RUN chmod -R 777 /app
