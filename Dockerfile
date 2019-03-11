FROM node:10-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm i
RUN npm run compile

CMD [ "npm", "start" ]

EXPOSE 8000
