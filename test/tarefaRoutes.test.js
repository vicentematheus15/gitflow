jest.mock("../src/services/tarefaService");

const request = require("supertest");
const service = require("../src/services/tarefaService");
const app = require("../src/app");
const { ErroValidacao, ErroNaoEncontrado } = require("../src/errors/erros");

const TAREFA = { id: 1, descricao: "Tarefa", concluida: false };

describe("API de tarefas (rotas)", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("GET / retorna a mensagem da API", async () => {
    const res = await request(app).get("/");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "API de tarefas funcionando." });
  });

  test("GET /tarefas retorna a lista", async () => {
    service.listarTarefas.mockResolvedValue([TAREFA]);

    const res = await request(app).get("/tarefas");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([TAREFA]);
  });

  test("GET /tarefas/:id retorna a tarefa e converte o id para número", async () => {
    service.buscarTarefa.mockResolvedValue(TAREFA);

    const res = await request(app).get("/tarefas/1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(TAREFA);
    expect(service.buscarTarefa).toHaveBeenCalledWith(1);
  });

  test("GET /tarefas/:id retorna 404 quando a tarefa não existe", async () => {
    service.buscarTarefa.mockRejectedValue(new ErroNaoEncontrado());

    const res = await request(app).get("/tarefas/999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "Tarefa não encontrada." });
  });

  test("GET /tarefas/:id retorna 400 quando o id é inválido", async () => {
    service.buscarTarefa.mockRejectedValue(
      new ErroValidacao("O id da tarefa deve ser um número inteiro positivo.")
    );

    const res = await request(app).get("/tarefas/abc");

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/id da tarefa/);
  });

  test("POST /tarefas cria a tarefa", async () => {
    service.criarTarefa.mockResolvedValue(TAREFA);

    const res = await request(app).post("/tarefas").send({ descricao: "Tarefa" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(TAREFA);
    expect(service.criarTarefa).toHaveBeenCalledWith("Tarefa");
  });

  test("POST /tarefas retorna 400 quando a descrição é inválida", async () => {
    service.criarTarefa.mockRejectedValue(
      new ErroValidacao("A descrição da tarefa é obrigatória.")
    );

    const res = await request(app).post("/tarefas").send({ descricao: "" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "A descrição da tarefa é obrigatória." });
  });

  test("POST /tarefas sem body envia undefined ao service", async () => {
    service.criarTarefa.mockResolvedValue(TAREFA);

    await request(app).post("/tarefas");

    expect(service.criarTarefa).toHaveBeenCalledWith(undefined);
  });

  test("POST /tarefas retorna 400 para JSON malformado", async () => {
    const res = await request(app)
      .post("/tarefas")
      .set("Content-Type", "application/json")
      .send("{descricao:");

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "JSON inválido." });
  });

  test("PUT /tarefas/:id atualiza a descrição", async () => {
    service.atualizarDescricao.mockResolvedValue({ ...TAREFA, descricao: "Nova" });

    const res = await request(app).put("/tarefas/1").send({ descricao: "Nova" });

    expect(res.statusCode).toBe(200);
    expect(res.body.descricao).toBe("Nova");
    expect(service.atualizarDescricao).toHaveBeenCalledWith(1, "Nova");
  });

  test("PUT /tarefas/:id retorna 404 quando a tarefa não existe", async () => {
    service.atualizarDescricao.mockRejectedValue(new ErroNaoEncontrado());

    const res = await request(app).put("/tarefas/999").send({ descricao: "Nova" });

    expect(res.statusCode).toBe(404);
  });

  test("PATCH /tarefas/:id/concluir conclui a tarefa", async () => {
    service.concluirTarefa.mockResolvedValue({ ...TAREFA, concluida: true });

    const res = await request(app).patch("/tarefas/1/concluir");

    expect(res.statusCode).toBe(200);
    expect(res.body.concluida).toBe(true);
  });

  test("PATCH /tarefas/:id/reabrir reabre a tarefa", async () => {
    service.reabrirTarefa.mockResolvedValue(TAREFA);

    const res = await request(app).patch("/tarefas/1/reabrir");

    expect(res.statusCode).toBe(200);
    expect(res.body.concluida).toBe(false);
  });

  test("DELETE /tarefas/:id exclui a tarefa", async () => {
    service.excluirTarefa.mockResolvedValue(TAREFA);

    const res = await request(app).delete("/tarefas/1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(TAREFA);
  });

  test("erro inesperado retorna 500 sem expor detalhes", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    service.listarTarefas.mockRejectedValue(new Error("falha de conexão com o banco"));

    const res = await request(app).get("/tarefas");

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "Erro interno do servidor." });
    consoleSpy.mockRestore();
  });

  test("rota inexistente retorna 404", async () => {
    const res = await request(app).get("/qualquer-coisa");

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "Rota não encontrada." });
  });
});
