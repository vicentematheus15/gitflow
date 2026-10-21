const request = require("supertest");
const app = require("../src/app");
const ListaTarefas = require("../src/index");

const NAO_ENCONTRADA = { error: "Tarefa não encontrada." };
const DESCRICAO_OBRIGATORIA = { error: "A descrição da tarefa é obrigatória." };

beforeEach(() => {
  app.locals.listaTarefas = new ListaTarefas();
});

const criar = descricao => request(app).post("/tarefas").send({ descricao });

describe("API de tarefas", () => {
  test("GET / retorna mensagem da API", async () => {
    const res = await request(app).get("/");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "API de tarefas funcionando." });
  });

  test("GET /tarefas retorna a lista de tarefas", async () => {
    await criar("Tarefa");
    const res = await request(app).get("/tarefas");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ id: 1, descricao: "Tarefa", concluida: false }]);
  });

  test("POST /tarefas cria uma tarefa", async () => {
    const res = await criar("Estudar Node.js");

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ id: 1, descricao: "Estudar Node.js", concluida: false });
  });

  test("POST /tarefas rejeita descrição vazia", async () => {
    const res = await criar("");

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(DESCRICAO_OBRIGATORIA);
  });

  test("GET /tarefas/:id retorna a tarefa existente", async () => {
    await criar("Minha tarefa");
    const res = await request(app).get("/tarefas/1");

    expect(res.statusCode).toBe(200);
    expect(res.body.descricao).toBe("Minha tarefa");
  });

  test("GET /tarefas/:id retorna 404 para tarefa inexistente", async () => {
    const res = await request(app).get("/tarefas/999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual(NAO_ENCONTRADA);
  });

  test("PUT /tarefas/:id atualiza a descrição", async () => {
    await criar("Antiga");
    const res = await request(app).put("/tarefas/1").send({ descricao: "Nova" });

    expect(res.statusCode).toBe(200);
    expect(res.body.descricao).toBe("Nova");
  });

  test("PUT /tarefas/:id retorna 404 quando a tarefa não existe", async () => {
    const res = await request(app).put("/tarefas/999").send({ descricao: "Nova" });

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual(NAO_ENCONTRADA);
  });

  test("PUT /tarefas/:id retorna 400 quando a descrição é inválida", async () => {
    await criar("Tarefa");
    const res = await request(app).put("/tarefas/1").send({ descricao: "" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual(DESCRICAO_OBRIGATORIA);
  });

  test("PATCH /tarefas/:id/concluir conclui a tarefa", async () => {
    await criar("Tarefa");
    const res = await request(app).patch("/tarefas/1/concluir");

    expect(res.statusCode).toBe(200);
    expect(res.body.concluida).toBe(true);
  });

  test("PATCH /tarefas/:id/concluir retorna 404 quando a tarefa não existe", async () => {
    const res = await request(app).patch("/tarefas/999/concluir");

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual(NAO_ENCONTRADA);
  });

  test("PATCH /tarefas/:id/reabrir reabre a tarefa", async () => {
    await criar("Tarefa");
    await request(app).patch("/tarefas/1/concluir");
    const res = await request(app).patch("/tarefas/1/reabrir");

    expect(res.statusCode).toBe(200);
    expect(res.body.concluida).toBe(false);
  });

  test("PATCH /tarefas/:id/reabrir retorna 404 quando a tarefa não existe", async () => {
    const res = await request(app).patch("/tarefas/999/reabrir");

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual(NAO_ENCONTRADA);
  });

  test("DELETE /tarefas/:id exclui a tarefa", async () => {
    await criar("Excluir");
    const res = await request(app).delete("/tarefas/1");

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(1);

    const lista = await request(app).get("/tarefas");
    expect(lista.body).toEqual([]);
  });

  test("DELETE /tarefas/:id retorna 404 quando a tarefa não existe", async () => {
    const res = await request(app).delete("/tarefas/999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual(NAO_ENCONTRADA);
  });

  test("rota inexistente retorna 404", async () => {
    const res = await request(app).get("/qualquer-coisa");

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "Rota não encontrada." });
  });
});
