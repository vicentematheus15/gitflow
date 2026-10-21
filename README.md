# gitflow

API REST simples de lista de tarefas (Node.js + Express). Os dados ficam apenas
em memória e são perdidos quando o servidor é reiniciado.

## Como rodar

```bash
npm install
npm start
```

A API sobe em `http://localhost:3000` (ou na porta definida em `PORT`).

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

Exemplo:

```bash
curl -X POST http://localhost:3000/tarefas \
  -H "Content-Type: application/json" \
  -d '{"descricao": "Estudar Docker"}'
```

Erros retornam `{ "error": "mensagem" }` com status 400 (dados inválidos) ou 404
(tarefa/rota não encontrada).

## Testes

```bash
npm test               # roda os testes
npm run test:coverage  # roda com relatório de cobertura
```

## Estrutura

```text
.
├── src/
│   ├── index.js   # classe ListaTarefas (regras de negócio)
│   ├── app.js     # rotas Express
│   └── server.js  # inicia o servidor
└── test/
    ├── lista-tarefas.test.js  # testes unitários
    └── api.test.js            # testes das rotas
```
