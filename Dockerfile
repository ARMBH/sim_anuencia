FROM node:slim

WORKDIR /app

COPY package*.json /app/

# Caso tenha proxy, configure seu usuário e senha
RUN npm config set proxy http://USER:SENHA@endereco.com.br:8080 

RUN npm install

RUN npm install pm2 -g

COPY . /app/

EXPOSE 3001

CMD ["pm2-docker", "start", "ecosystem.config.js"]