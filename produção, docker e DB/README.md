# Anuência Digital - Sugestões para o ambiente de produção

## Ambiente de produção

Check-list para funcionar em Produção:

- Ver arquivo .envExemplo nesta pasta, faça as devidas alterações e salve no diretório raiz do aplicativo renomeando o arquivo para `.env`

- Se for utilizar a imagem Dockerfile existente ou o PM2, ver arquivo ecosystemExemplo nesta pasta, fazer as alterações e salvar no diretorio raiz do aplicativo, com o nome de "ecosystem.config.js".

- O clientEnv.js é um arquivo que foi incluído e deve ficar na pasta /client/src. Contém a chave do google caso se opte pelo Google maps para utilizar a parte de mapas do sistema, que se encotnra atualmente em estágio experimental. Lembrar de conferir se ele está no gitignore da pasta client.

## Docker

### Versão estável em

Se optar por utilizar o docker, visite https://cloud.docker.com/repository/docker/sverissimo/sim_anuencia para baixar a imagem do código (atualizada em 06ago19).

### Criando e utilizando uma imagem docker

1. Gerar `ecosystem.config.js` na pasta raíz deste repositório com as variáveis desejadas
2. No diretório do client executar `npm run build`
3. Finalmente, na pasta raíz deste repositório, executar:

```
docker build -t conta/img:tag .
```


4. Envie a imagem criada para sua conta no Docker Hub:

```
docker push conta/img:tag
```
#### Observações

- Para criar uma nova imagem, não é necessário alterar o arquivo Dockerfile. Apenas altere o código do aplicativo e rode o comando acima.

- Lembre-se de verificar se o .dockerignore inclui a pasta "node_modules"

- Sempre rodar o build do client ANTES de rodar o comando acima

- A tag é opcional e pode-se dar a ela o nome de sua preferência.

### Inicializando o docker

#### Se for utilizar a imagem existente:

1. Copie o arquivo 'docker-compose.yml' para a pasta raiz do aplicativo no servidor (ex: /anuencia/)

2. Execute o seguinte comando na respectiva pasta

```
sudo docker-compose up
```

#### Utilizando a nova imagem criada

Se for utilizar a nova imagem (criada com os passos do item "Criando e utilizando imagem Docker" acima), antes de rodar o comando acima, altere o arquivo docker-compose.yml no campo "image:" apontando para a nova imagem criada.

Se tiver sido criado uma tag, pode ser necessário acrescentar a tag depois do nome da imagem, separada por ":". Ex: sverissimo/sim_anuencia:06ago19

\*Lembre-se sempre de fazer um backup do arquivo docker-compose.yml para poder voltar à imagem anterior caso haja algum problema.

## Web server ou proxy reverso

O autor optou por utilizar o Ngnix, mas você pode usar o Apache, Apache2 (nativo no ubuntu), etc ou nenhum. Caso o aplicativo esteja apresentando problemas em um novo ambiente, sugiro que teste acessar sem proxy reverso para identificar se o problema é referente à configuração de proxy/webserver.

As configurações do nginx do autor estão nesta pasta, no arquivo nginx.conf

## Restauração do Banco de Dados

1. Se o backup não tiver sido criado, criar o backup com o comando

```
sudo mongodump --db sim_anuencia_db -o [PASTA/DESTINO] --forceTableScan
```

2. Entrar na pasta onde estiver salvo o backup

3. Executar o comando

```
mongorestore -d sim_anuencia_db ./

```

4. O diretório padrão dos dados do mongo é /data/db ou var/lib/mongodb, dependendo do sistema operacional ou da versão do mongodb.

5) Verificar se os dados foram carregados para o Banco corretamente

```
mongo
```

```
show dbs
```
