FROM node:16

RUN mkdir -p /opt/app
WORKDIR /opt/app

# Install app dependencies
COPY package*.json ./
COPY yarn.lock ./

RUN yarn --frozen-lockfile

# Bundle app source
COPY . .

EXPOSE 3000
CMD yarn start