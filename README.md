# gitflow

API REST de lista de tarefas em **arquitetura em camadas** (routes → services →
repositories), com banco **MySQL**, executada com **Docker Compose**.

## Arquitetura em camadas

```text
Cliente HTTP
    │
    ▼
routes/        recebe a requisição, lê id/body e devolve a resposta HTTP
    │
    ▼
services/      regras de negócio e validações (descrição obrigatória, tarefa existe, id válido)
    │
    ▼
repositories/  único lugar com SQL; conversa com o banco
    │
    ▼
config/database.js  →  MySQL
```

Cada camada só conhece a de baixo. Os erros (`ErroValidacao`, `ErroNaoEncontrado`)
sobem até o middleware `tratarErros`, que decide o status HTTP (400, 404 ou 500).

## Comunicação entre os containers

```text
┌────────────── rede "backend" (criada pelo Compose) ──────────────┐
│                                                                  │
│   gitflow-api (Node/Express)  ── DB_HOST=db:3306 ──►  gitflow-db │
│        porta 3000                                   (MySQL 8.0)  │
│                                                       volume:    │
│                                                       mysql_data │
└──────────────┬───────────────────────────────────────────────────┘
               │ 3000:3000
               ▼
        seu computador (http://localhost:3000)
```

- A API encontra o banco pelo **nome do serviço** (`db`): o DNS interno da rede do Compose resolve esse nome para o IP do container.
- A porta do MySQL **não é publicada** no computador. Só a API, dentro da rede `backend`, consegue acessá-lo.
- `depends_on` com `condition: service_healthy`: a API só sobe depois que o MySQL passa no healthcheck.
- A tabela `tarefas` é criada por `database/init.sql` na primeira inicialização, e os dados ficam no volume `mysql_data`.

## Como rodar

Requisito: Docker com Docker Compose.

```bash
cp .env.example .env     # opcional: o compose já tem os mesmos valores como padrão
docker compose up --build
```

A API sobe em `http://localhost:3000`. Para parar:

```bash
docker compose down        # mantém os dados (volume)
docker compose down -v     # apaga também os dados
```

### Conferindo que tudo funciona

```bash
docker compose ps                          # api e db devem estar "healthy"
curl http://localhost:3000/                # {"message":"API de tarefas funcionando."}

curl -X POST http://localhost:3000/tarefas \
  -H "Content-Type: application/json" \
  -d '{"descricao": "Estudar Docker Compose"}'
curl http://localhost:3000/tarefas

# a API consegue "enxergar" o banco pelo nome do serviço:
docker compose exec api sh -c "getent hosts db"

# o dado gravado pela API está no banco:
docker compose exec db mysql -uapp_user -papp_password app_db -e "SELECT * FROM tarefas;"

# as duas redes/containers na mesma rede:
docker network inspect gitflow-dev_backend
```

> O nome da rede usa o nome da pasta do projeto. Se a pasta tiver outro nome,
> veja o nome real com `docker network ls`.

## Rotas

| Método | Rota | Descrição | Body |
| --- | --- | --- | --- |
| GET | `/` | Verifica se a API está funcionando | — |
| GET | `/tarefas` | Lista todas as tarefas | — |
| GET | `/tarefas/:id` | Busca uma tarefa | — |
| POST | `/tarefas` | Cria uma tarefa | `{ "descricao": "Estudar" }` |
| PUT | `/tarefas/:id` | Atualiza a descrição | `{ "descricao": "Novo texto" }` |
| PATCH | `/tarefas/:id/concluir` | Marca como concluída | — |
| PATCH | `/tarefas/:id/reabrir` | Marca como não concluída | — |
| DELETE | `/tarefas/:id` | Exclui a tarefa | — |

Erros retornam `{ "error": "mensagem" }`: **400** (dados inválidos), **404**
(tarefa ou rota não encontrada) e **500** (erro interno, sem expor detalhes).

## Testes

Os testes não precisam de banco: cada camada é testada isolando a de baixo.

| Arquivo | O que testa | O que é simulado (mock) |
| --- | --- | --- |
| `test/tarefaRepository.test.js` | SQL e conversão dos dados | conexão com o banco |
| `test/tarefaService.test.js` | regras de negócio e validações | repository |
| `test/tarefaRoutes.test.js` | endpoints, status HTTP e erros | service |

```bash
npm install
npm test               # roda os testes
npm run test:coverage  # com cobertura (mínimo de 80% exigido)
```

## Estrutura

```text
.
├── docker-compose.yml        # api + db, rede, volume, healthchecks
├── Dockerfile                # imagem da API
├── .env.example              # variáveis de ambiente (opcional)
├── database/
│   └── init.sql              # criação da tabela tarefas
├── src/
│   ├── server.js             # inicia o servidor
│   ├── app.js                # monta o Express (rotas e middlewares)
│   ├── routes/               # camada HTTP
│   ├── services/             # regras de negócio
│   ├── repositories/         # acesso ao banco (SQL)
│   ├── errors/               # erros da aplicação
│   ├── middlewares/          # tratamento de erros
│   └── config/database.js    # pool de conexão MySQL
└── test/                     # testes por camada
```