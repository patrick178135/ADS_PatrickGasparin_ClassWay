# ClassWay

Sistema para gerenciamento de transporte de estudantes, desenvolvido como projeto acadêmico do curso de **Análise e Desenvolvimento de Sistemas (ADS)**.

O sistema permite gerenciar informações relacionadas ao transporte escolar, incluindo alunos, embarques e desembarques, rotas, horários, veículos, motoristas, pagamentos e presença dos alunos.

## Tecnologias utilizadas

### Frontend

* Next.js 15
* React 19
* TypeScript
* Material UI
* React Bootstrap
* Bootstrap
* Axios
* React Query

### Backend

* Node.js
* NestJS
* TypeScript
* TypeORM
* PostgreSQL
* JWT
* bcrypt
* Class Validator

## Estrutura do projeto

```text
ADS_PatrickGasparin_ClassWay/
├── back/                 # API / Backend
│   ├── src/
│   ├── test/
│   ├── .env.example
│   ├── package.json
│   └── ...
│
├── front/                # Aplicação web / Frontend
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
│
└── README.md
```

## Pré-requisitos

Antes de executar o projeto, certifique-se de possuir instalado:

* Git
* Node.js
* npm
* PostgreSQL

Você pode verificar as versões instaladas com:

```bash
git --version
node --version
npm --version
psql --version
```

## Baixando o projeto

Clone o repositório:

```bash
git clone https://github.com/PatrickGasparin/ADS_PatrickGasparin_ClassWay.git
```

Entre na pasta do projeto:

```bash
cd ADS_PatrickGasparin_ClassWay
```

---

# Configuração do PostgreSQL

O backend utiliza PostgreSQL como banco de dados.

Por padrão, a aplicação está configurada para utilizar:

```text
Host: localhost
Porta: 5432
Banco: classway
Usuário: postgres
```

## 1. Criar o banco de dados

Acesse o PostgreSQL:

```bash
sudo -u postgres psql
```

Depois, crie o banco:

```sql
CREATE DATABASE classway;
```

Para sair do PostgreSQL:

```sql
\q
```

> Caso esteja utilizando outro usuário ou senha no PostgreSQL, ajuste as configurações do arquivo `.env` conforme o seu ambiente.

---

# Configuração do Backend

Entre na pasta do backend:

```bash
cd back
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

Abra o arquivo `.env`:

```bash
nano .env
```

Configure as informações do PostgreSQL de acordo com o seu ambiente.

Exemplo:

```env
DATABASE_TYPE=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_DATABASE=classway
DATABASE_PASSWORD=SUA_SENHA_AQUI
DATABASE_AUTOLOADENTITIES=true
DATABASE_SYNCHRONIZE=true

JWT_SECRET=SEU_SEGREDO_AQUI
JWT_TOKEN_AUDIENCE=meuApp
JWT_TOKEN_ISSUER=login
JWT_TTL=3600
```


## Executando o Backend

Ainda dentro da pasta `back`, execute:

```bash
npm run start:dev
```

O backend será iniciado por padrão em:

```text
http://localhost:3002
```

O modo `start:dev` também habilita o modo de desenvolvimento com atualização automática durante alterações no código.

---

# Configuração do Frontend

Abra outro terminal e volte para a raiz do projeto:

```bash
cd ADS_PatrickGasparin_ClassWay/front
```

Instale as dependências:

```bash
npm install
```

## Executando o Frontend

Execute:

```bash
npm run dev
```

Após iniciar, acesse:

```text
http://localhost:3000
```

---

# Executando o projeto completo

Para testar o sistema, você precisa manter **dois terminais abertos**.

### Terminal 1 — Backend

```bash
cd ADS_PatrickGasparin_ClassWay/back
npm install
npm run start:dev
```

Backend:

```text
http://localhost:3002
```

### Terminal 2 — Frontend

```bash
cd ADS_PatrickGasparin_ClassWay/front
npm install
npm run dev
```

Frontend:

```text
http://localhost:3000
```

Depois, abra o navegador em:

```text
http://localhost:3000
```

### Carga inicial do banco de dados

Após criar o banco de dados classway, é necessário realizar a carga inicial de alguns dados utilizados pelo sistema.

Esses dados incluem os perfis de usuário e uma cidade inicial.

Acesse o banco de dados:

```bash
sudo -u postgres psql -d classway
```

Execute os seguintes comandos SQL:

```sql
INSERT INTO perfil ("nome")
VALUES ('ADMINISTRADOR');

INSERT INTO perfil ("nome")
VALUES ('MOTORISTA');

INSERT INTO perfil ("nome")
VALUES ('ALUNO');

INSERT INTO cidade ("nome", "UF")
VALUES ('Porto Alegre', 'RS');
```

Após executar os comandos, você pode verificar se os dados foram inseridos corretamente:

```sql
SELECT * FROM perfil;
SELECT * FROM cidade;
```

Para sair do PostgreSQL:

```
\q
```

Importante

A rota:

http://localhost:3000/create.usuario

é uma exceção no fluxo de autenticação, pois não exige um token JWT.

Isso permite que um usuário seja criado quando o sistema ainda não possui nenhum usuário cadastrado.

Após o cadastro, ao tentar acessar uma área protegida, como a página de usuários, o sistema verificará a existência de um token válido.

Como o primeiro usuário ainda não realizou login, será exibida uma página informando que é necessário estar logado.

Nessa página, basta clicar no link para ir para o Login, realizar a autenticação com o usuário recém-criado e, após o login, acessar novamente as áreas protegidas do sistema.

---

# Testes

## Backend

Para executar os testes unitários:

```bash
cd back
npm run test
```

Para executar os testes com cobertura:

```bash
npm run test:cov
```

Para executar os testes end-to-end:

```bash
npm run test:e2e
```

## Frontend

Na pasta `front`:

```bash
npm run test
```

---

# Autenticação

O backend utiliza JWT para autenticação e `bcrypt` para tratamento de senhas.

Após a inicialização do sistema, utilize as funcionalidades de autenticação disponibilizadas pela aplicação para acessar as áreas protegidas.

---

# Desenvolvimento

Durante o desenvolvimento, recomenda-se executar:

### Backend

```bash
npm run start:dev
```

### Frontend

```bash
npm run dev
```

As duas aplicações devem permanecer executando simultaneamente para que o frontend consiga consumir a API do backend.

---

# Banco de dados

O projeto utiliza **TypeORM** para comunicação com o PostgreSQL.

A configuração atual possui:

```env
DATABASE_AUTOLOADENTITIES=true
DATABASE_SYNCHRONIZE=true
```

Com `DATABASE_SYNCHRONIZE=true`, o TypeORM pode sincronizar automaticamente a estrutura do banco de dados com as entidades da aplicação durante a execução.

> Para ambientes de produção, recomenda-se utilizar migrations e revisar cuidadosamente a configuração de sincronização automática.

---

# Principais funcionalidades

O ClassWay foi desenvolvido para centralizar o gerenciamento do transporte de estudantes.

Entre as funcionalidades estão:

* Cadastro e gerenciamento de alunos
* Controle de presença
* Registro de embarques e desembarques
* Gerenciamento de rotas
* Controle de horários
* Cadastro de veículos
* Cadastro de motoristas
* Gerenciamento de pagamentos
* Autenticação de usuários
* Controle de acesso
* Comunicação entre frontend e backend através de API REST

---

# Sobre o projeto

Projeto desenvolvido como parte da formação em **Análise e Desenvolvimento de Sistemas (ADS)**, com o objetivo de aplicar conhecimentos de desenvolvimento de aplicações web, APIs, banco de dados, autenticação e arquitetura de software.

---

# Autor

**Patrick Gasparin**

GitHub:

https://github.com/PatrickGasparin

---

# Licença

Este projeto foi desenvolvido para fins acadêmicos e de estudo.
