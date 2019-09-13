FROM node:slim

WORKDIR /app

COPY package*.json /app/

RUN npm install

RUN npm install pm2 -g

COPY . /app/

EXPOSE 3001

CMD ["pm2-docker", "start", "ecosystem.config.js"]