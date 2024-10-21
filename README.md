# URL Shortener

Este projeto tem como objetivo encurtar URLs.  
Foi adicionado um arquivo `.env` já preenchido para fins de praticidade de execução.

## Versão do Node.js

Este projeto utiliza Node.js **20.18.0**.

## Acesso remoto do projeto
Foi realizado o deploy do projeto na nuvem.  
- URL base do projeto: <a href="http://191.252.220.249:3333" target="_blank">http://191.252.220.249:3333</a>  
- Link da documentação: <a href="http://191.252.220.249:3333/api" target="_blank">http://191.252.220.249:3333/api</a>  

É possível também acessar o banco de dados e verificar os usuários e URLs cadastradas.  
Seguem as credenciais para acessar o PostgreSQL:  
- **Host**: 191.252.220.249
- **Porta**: 5432
- **Usuário**: encurtador-user
- **Senha**: U2FsdGVkX18OBAYSIGZ6XCuTeogsHjfGfJsflkpyE  

**Obs.:** a máquina que hospeda o projeto é bem simples, com apenar 1 vCPU e 512MB de RAM. Por este motivo pode haver timeout nas requisições e tentativas de conexão com o banco. Caso ocorra, basta tentar novamente.

## Executando com Docker Compose

Para executar o projeto com Docker Compose, certifique-se de que as portas **3333** e **5432** da máquina estão livres.

Execute o seguinte comando na pasta raiz do projeto (mesma pasta que contém o arquivo _docker-compose.yml_):  
`docker compose up -d`  
Este comando irá subir os containers do PostgreSQL e da API.

- A API e seus endpoints podem ser acessados através de <a href="http://localhost:3333" target="_blank">http://localhost:3333</a>.
- A documentação da API pode ser acessada em <a href="http://localhost:3333/api" target="_blank">http://localhost:3333/api</a>.

**Obs.:** verificar se a máquina possui o comando `docker compose` ou o obsoleto `docker-compose` com hífen.

## Executando localmente

Como o `.env` é utilizado pelo Docker Compose, torna-se necessário primeiro ajustar as variáveis de ambiente e subir o banco de dados localmente:

- Abra o arquivo `.env` e substitua `NODE_ENV=production` por `NODE_ENV=development`.

A partir daqui, as variáveis do banco de dados poderiam também ser alteradas para um possível banco de dados já existente.  
No entanto, vamos assumir que vamos subir o mesmo banco que está no `docker-compose.yml`. Neste caso, não é necessário alterar as variáveis de ambiente do banco de dados. Execute o comando:  
`docker compose up database-encurtador -d`

Isso fará com que o container do banco de dados execute.

Para executar a API, basta executar os comandos:

- `npm ci`
- `npm run start:dev`

**Obs.:** certifique-se de que as portas **5432** e **3333** estão livres.

## Executando testes

Para executar testes, primeiramente instale as dependências do projeto:  
`npm ci`

Em seguida, execute os testes:  
`npm test`

**Obs.:** os testes e build estão incluídos e são executados automaticamente no pipeline CI do GitHub Actions, além da execução dos testes no pre-commit.

## Fazendo requisições para os endpoints

A documentação está na URL base, no endpoint `/api` (exemplo: <a href="http://localhost:3333" target="_blank">http://localhost:3333</a>).  

Você pode importar o arquivo `Insomnia_2024-10-20-encurtador-url.yaml` no Insomnia e realizar as requisições.

A variável `baseUrl` está com o valor `http://localhost:3333`.  
Lembre-se de atualizá-la, caso necessário.


## Descrição das variáveis de ambiente
- **DB_HOST**: host do PostgreSQL  
- **DB_PORT**: porta do PostgreSQL  
- **DB_USER**: usuário do PostgreSQL  
- **DB_PASSWORD**: senha do PostgreSQL  
- **DB_DATABASE**: nome do banco de dados do PostgreSQL  
- **API_PORT**: porta que a aplicação do NestJS irá utilizar para executar  
- **NODE_ENV**: ambiente Node (`development` ou `production`)  
- **JWT_SECRET**: chave JWT  
- **BASE_URL**: URL base do NestJS que é usada para criar a URL encurtada  