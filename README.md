# 🚗 WebAPI de Controle de Utilização de Automóveis

API REST desenvolvida com **Node.js** e **Express.js** para gerenciar a utilização de automóveis em uma empresa. A aplicação permite administrar veículos e motoristas, registrar períodos de utilização e garantir regras de negócio que impedem conflitos na alocação de recursos.

## 🚀 Tecnologias Utilizadas

- **[Node.js](https://nodejs.org/)** — Ambiente de execução JavaScript.
- **[Express.js](https://expressjs.com/)** — Framework para desenvolvimento da API REST.
- **[Jest](https://jestjs.io/)** — Framework para execução de testes automatizados.
- **[Supertest](https://github.com/ladjs/supertest)** — Biblioteca para testes de requisições HTTP.
- **[CORS](https://www.npmjs.com/package/cors)** — Middleware para controle de requisições de diferentes origens.

## ✨ Funcionalidades

### 🚘 Gestão de automóveis

- Cadastrar novos automóveis.
- Consultar um automóvel pelo ID.
- Listar automóveis cadastrados.
- Filtrar automóveis por cor e marca.
- Atualizar os dados de um automóvel.
- Excluir automóveis cadastrados.

### 👤 Gestão de motoristas

- Cadastrar novos motoristas.
- Consultar um motorista pelo ID.
- Listar motoristas cadastrados.
- Filtrar motoristas pelo nome.
- Atualizar os dados de um motorista.
- Excluir motoristas cadastrados.

### 🔑 Gestão de utilizações

- Registrar o início da utilização de um automóvel por um motorista.
- Informar o motivo e a data de início da utilização.
- Finalizar uma utilização, registrando a data de término.
- Consultar o histórico de utilizações, incluindo os dados dos motoristas e dos automóveis envolvidos.

## 🛡️ Regras de Negócio

A aplicação implementa regras para evitar conflitos durante a utilização dos veículos:

1. **Disponibilidade do automóvel:** um automóvel não pode ser utilizado por mais de um motorista simultaneamente.
2. **Disponibilidade do motorista:** um motorista não pode utilizar mais de um automóvel simultaneamente.
3. **Registro de utilização:** cada utilização possui informações sobre o motorista, o automóvel, o motivo e a data de início.
4. **Finalização da utilização:** ao encerrar o uso, a data de término é registrada para manter o histórico de utilização.

## ⚙️ Como Executar o Projeto

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) — versão 18 ou superior.
- [Git](https://git-scm.com/).

### 1. Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd <NOME_DO_REPOSITORIO>
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie o servidor

Em ambiente de desenvolvimento:

```bash
npm run dev
```

Após iniciar o servidor, a API estará disponível em:

`http://localhost:3000`

> **Observação:** o comando `npm run dev` depende de estar configurado no arquivo `package.json`.

## 🧪 Executando os Testes

O projeto utiliza Jest e Supertest para executar testes automatizados, incluindo testes unitários e de integração.

Para executar a suíte de testes, utilize:

```bash
npm test
```

## 📌 Endpoints da API

Os endpoints estão organizados em três grupos principais.

### 👤 Motoristas — `/drivers`

| Método HTTP | Endpoint | Descrição |
|---|---|---|
| `POST` | `/drivers` | Cadastra um motorista. |
| `GET` | `/drivers` | Lista os motoristas cadastrados. |
| `GET` | `/drivers?nome=exemplo` | Filtra motoristas pelo nome. |
| `GET` | `/drivers/:id` | Busca um motorista pelo ID. |
| `PUT` | `/drivers/:id` | Atualiza os dados de um motorista. |
| `DELETE` | `/drivers/:id` | Exclui um motorista. |

### 🚘 Automóveis — `/automobiles`

| Método HTTP | Endpoint | Descrição |
|---|---|---|
| `POST` | `/automobiles` | Cadastra um automóvel. |
| `GET` | `/automobiles` | Lista os automóveis cadastrados. |
| `GET` | `/automobiles?cor=azul&marca=ford` | Filtra automóveis por cor e marca. |
| `GET` | `/automobiles/:id` | Busca um automóvel pelo ID. |
| `PUT` | `/automobiles/:id` | Atualiza os dados de um automóvel. |
| `DELETE` | `/automobiles/:id` | Exclui um automóvel. |

### 🔑 Utilizações — `/utilizations`

| Método HTTP | Endpoint | Descrição |
|---|---|---|
| `POST` | `/utilizations` | Registra o início de uma utilização. |
| `PATCH` | `/utilizations/:id/end` | Finaliza uma utilização em aberto. |
| `GET` | `/utilizations` | Lista as utilizações com os dados dos motoristas e automóveis. |

## 📄 Licença

Consulte as informações de licença do repositório, caso aplicável.