# squirrel_resource

Aqui vou abordar as informações para utilização da biblioteca.

## Conteúdo

- [Instalação](#instalação)
- [Inicializando projeto](#inicializando-projeto)
- [Criando servidor](#criando-servidor)
- [Variaveis de Ambiente](#variaveis-de-ambiente)
- [Roteamento](#roteamento)
- [Middleware](#middleware)

### Instalação

``` bash
$ npm install --save dotenv mysql2 express body-parser squirrel_orm squirrel_resource
``` 
observação a biblioteca usa as seguintes biblitecas:
  - <a href="https://www.npmjs.com/package/dotenv">dotenv</a>
  - <a href="https://www.npmjs.com/package/mysql2">mysql2</a>
  - <a href="https://www.npmjs.com/package/express">express</a>
  - <a href="https://www.npmjs.com/package/body-parser">body-parser</a>
  - <a href="https://www.npmjs.com/package/squirrel_orm">squirrel_orm</a>

### Inicializando projeto

Todos os arquivos são carregados utilizando Storage.load

``` js
const { Storage } = require('squirrel_resource')

// vai criar os diretorios e os principais arquivos
Storage.load()
```

Copie e cole o .env-example como .env

``` bash
$ cp .env-example .env
```

### Criando servidor

Após inicializar o projeto e criar o .env seguindo as informações a cima, você pode criar o arquivo principal do seu projeto.

``` js
const { Storage, Middleware } = require('squirrel_resource')
// vai criar os diretorios e os principais arquivos
Storage.load()
const Api = require('./api'),
      middleware = Middleware.build()

// carrega o roteamento do arquivo api/index.js
middleware.router(Api)

// após criar o servior e iniciar a escuta
// retorna o server criado
// retornos Http, Https
// dependendo da configuração no env
// retorno do callback do listen é
// { host: string, port: number, protocol: 'http' | 'https' }
const server = middleware.listen(({ host, port, protocol }) => {
  console.log(`server open in ${protocol}://${host}:${port}`)
})
```

### Variaveis de Ambiente

Por padrão seu env vai vir assim
``` env
HTTP_PROTOCOL=http
HTTP_HOST=127.0.0.1
HTTP_PORT=3000

// maximo de requisições por minuto
MAX_REQUEST_SECONDS=20
// quantidade de minutos para abrir a api
// quando atingir o maximo de requisições
REQUEST_RESET_SECONDS=60
// limpeza do cache
// passado em segundos 3600 é 1 hora
SERVER_CACHE_CLEAR_SECOND=3600

// chave secreta do seu aplicativo
SERVER_SECRET=
// senha secreta do seu aplicativo
SERVER_PASSPHRASE=
// iv para utilização da criptografia simmetrica
SERVER_IV=

// opções para o https
HTTP_CERT=
HTTP_KEY=
HTTP_PFX=
HTTP_PASSPHRASE=


// configurações da conexão com o banco de dados
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=
MYSQL_TIMEOUT=18000

// opções para utilização de ssl na conexão com o banco de dados
MYSQL_CERT=
MYSQL_KEY=
MYSQL_CA=
MYSQL_PFX=
MYSQL_PASSPHRASE=
MYSQ_CRL=
MYSQL_CIPHERS=
```

Para adicionar secret, passphrase ou iv, recomendo que utilize o Make para configurar,
o Make é criado quando se utiliza o 'Storage.load', e responsavel por criar seus arquivos para você.

``` bash
"--set responsavel por carregar o valor"
"--env-secret ou --env-passphrase é responsavel por indicar onde vai ser salvo o valor"
"--hash informa que o valor vai utilizar o hash antes de salvar"
"para mais utilizações execute 'node make --help'"
$ node make --set=[value] --env-secret --hash
```

``` bash
$ node make --set=[value] --env-passphrase --hash
```

#### não recomendado
``` bash
$ node make --set=[value] --env-secret --env-passphrase --hash
```

Você também pode informar se já quer adicionar valor ao iv

``` bash
$ node make --set=[value] --env-secret --iv --hash
```

``` bash
$ node make --set=[value] --env-passphrase --iv --hash
```

obs: hash utiliza do algoritmo 'sha512' e adiciona por padrão em hexadecimal

### Roteamento 

A bibliteca já te fornece um arquivo em 'api/index.js' para definição das rotas.
Mas você também pode criar novos arquivos de rota, para não fazer manualmente utilize:

``` bash 
$ node make --router=[NAME]
```

Vai criar uma rota para você, depois disso é so importar no seu arquivo em api/index.js

``` js
const { Router } = require('squirrel_resource')
const [NAME]Router = require('./[NAME]Router')

module.exports = Router().use([NAME]Router)
```

Para deixar mais didático o exemplo abaixo vai deixar mais claro (saia do escuro meu jovem).

``` bash 
$ node make --router=Auth
```

``` js
const { Router } = require('squirrel_resource')
const AuthRouter = require('./AuthRouter')

module.exports = Router().use(AuthRouter)
```

Para definir rotas é a mesma coisa que no express porém com algumas funcionalidades a mais:

- prefix
- middleware

``` js
const { Router } = require('squirrel_resource')

module.exports = Router()
  .get('/', function (request, response) {
    ...code
  })
// outra forma e importando o seu controller
```

Para importar o seu controller basta criar utilizando o make, neste exemplo crio também com o service.
``` bash 
$ node make --controller=Auth --service
```

``` js
const { Router } = require('squirrel_resource')

/**
 * primeiro parametro é a rota
 * segundo parametro pode ser uma string contendo o nome do seu controller ou uma função
 * terceiro parametro é o metodo que vai ser chamado
 * 
 * se você utilizou o make o controller vem limpo sem funções para você definir o nome delas.
 * estou supondo que você colocou uma função get e outra função post
 * as funções podem ser assíncronas
 */
module.exports = Router()
  .get('/', 'AuthController.js', 'get')
  .get('/', 'AuthController.js', 'post')
```

Você pode definir prefixos.

``` js
const { Router } = require('squirrel_resource')

/**
 * primeiro parametro é a rota
 * segundo parametro pode ser uma string contendo o nome do seu controller ou uma função
 * terceiro parametro é o metodo que vai ser chamado
 * 
 * se você utilizou o make o controller vem limpo sem funções para você definir o nome delas.
 * estou supondo que você colocou uma função get e outra função post
 * as funções podem ser assíncronas
 */
module.exports = Router()
  .prefix('/api', function (api) {
    // aqui crio o prefixo api
    // e depois crio o prefixo v1 pois se você for utilizar
    // versões para rota lembre-se de manter a versão anterior para não
    // ocorrer erros em quem as utiliza
    return api.prefix('/v1', function (v1) {
      return v1
        .get('/', 'AuthController.js', 'get')
        .get('/', 'AuthController.js', 'post')
    })
  })
```

### Middleware

Você pode utilizar duas formas para incluir o middleware.

primeira forma é você utilizar o Router para fazer isto.

``` js
const { Router } = require('squirrel_resource')

module.exports = Router().use(function (request, response, next) {

})
```

ou 

``` js
const { Router } = require('squirrel_resource')

module.exports = Router().use('/', function (request, response, next) {

})
```

caso você queira colocar o middleware apenas em uma rota você pode criar desta forma:

``` bash 
$ node make --middleware=[NAME]
```

o middleware vai ser criado no diretorio http/middleware/[NAME]Middleware.js

basta adicionar a sua rota:

``` js
const { Router } = require('squirrel_resource')

module.exports = Router().middleware('/', '[NAME]Middleware.js')
```

ou 

``` js
const { Router } = require('squirrel_resource')

module.exports = Router().middleware('/', function(request, response, next) {

})
```

exemplo de uso:

``` bash 
$ node make --middleware=Auth
```

``` js
const { Router } = require('squirrel_resource')

module.exports = Router().middleware('/', 'AuthMiddleware.js')
```