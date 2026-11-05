jest.mock("../src/config/database", () => ({ execute: jest.fn() }));

const db = require("../src/config/database");
const repository = require("../src/repositories/tarefaRepository");

const LINHA = { id: 1, descricao: "Estudar", concluida: 0 };
const TAREFA = { id: 1, descricao: "Estudar", concluida: false };

describe("tarefaRepository", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("listar retorna as tarefas convertendo concluida para boolean", async () => {
    db.execute.mockResolvedValue([[LINHA, { ...LINHA, id: 2, concluida: 1 }]]);

    const tarefas = await repository.listar();

    expect(tarefas).toEqual([TAREFA, { id: 2, descricao: "Estudar", concluida: true }]);
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining("FROM tarefas"));
  });

  test("buscarPorId retorna a tarefa encontrada", async () => {
    db.execute.mockResolvedValue([[LINHA]]);

    await expect(repository.buscarPorId(1)).resolves.toEqual(TAREFA);
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining("WHERE id = ?"), [1]);
  });

  test("buscarPorId retorna null quando não encontra", async () => {
    db.execute.mockResolvedValue([[]]);

    await expect(repository.buscarPorId(99)).resolves.toBeNull();
  });

  test("criar insere a tarefa e retorna o registro criado", async () => {
    db.execute
      .mockResolvedValueOnce([{ insertId: 1 }])
      .mockResolvedValueOnce([[LINHA]]);

    await expect(repository.criar("Estudar")).resolves.toEqual(TAREFA);
    expect(db.execute).toHaveBeenNthCalledWith(
      1,
      "INSERT INTO tarefas (descricao) VALUES (?)",
      ["Estudar"]
    );
  });

  test("atualizarDescricao atualiza e retorna a tarefa", async () => {
    db.execute.mockResolvedValueOnce([{}]).mockResolvedValueOnce([[LINHA]]);

    await expect(repository.atualizarDescricao(1, "Nova")).resolves.toEqual(TAREFA);
    expect(db.execute).toHaveBeenNthCalledWith(
      1,
      "UPDATE tarefas SET descricao = ? WHERE id = ?",
      ["Nova", 1]
    );
  });

  test("definirConcluida atualiza o status e retorna a tarefa", async () => {
    db.execute
      .mockResolvedValueOnce([{}])
      .mockResolvedValueOnce([[{ ...LINHA, concluida: 1 }]]);

    await expect(repository.definirConcluida(1, true)).resolves.toEqual({
      ...TAREFA,
      concluida: true
    });
    expect(db.execute).toHaveBeenNthCalledWith(
      1,
      "UPDATE tarefas SET concluida = ? WHERE id = ?",
      [true, 1]
    );
  });

  test("excluir remove a tarefa pelo id", async () => {
    db.execute.mockResolvedValue([{}]);

    await repository.excluir(1);

    expect(db.execute).toHaveBeenCalledWith("DELETE FROM tarefas WHERE id = ?", [1]);
  });
});
