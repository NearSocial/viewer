FROM node:20.15-alpine as build
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

FROM nginx:1.26.1-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
