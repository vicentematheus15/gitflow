const {
  criarTarefa,
  listarTarefas,
  concluirTarefa,
  excluirTarefa,
  atualizarDescricao,
  reabrirTarefa,
  buscarTarefa,
  getListaTarefas,
  _resetListaTarefas
} = require("../index");

// `listaTarefas` é um estado em memória compartilhado pelo módulo, então
// resetamos antes de cada teste para garantir isolamento entre os casos.
beforeEach(() => {
  _resetListaTarefas();
});

// --- criarTarefa ---------------------------------------------------------

test("criarTarefa adiciona uma nova tarefa com id incremental e concluida=false", () => {
  criarTarefa("Estudar JavaScript");

  expect(getListaTarefas()).toEqual([
    { id: 1, descricao: "Estudar JavaScript", concluida: false }
  ]);
});

test("criarTarefa incrementa o id a partir da quantidade atual de tarefas", () => {
  criarTarefa("Primeira tarefa");
  criarTarefa("Segunda tarefa");

  expect(getListaTarefas().map(tarefa => tarefa.id)).toEqual([1, 2]);
});

test("criarTarefa aceita descrição vazia ou nula (sem validação de entrada no código atual)", () => {
  criarTarefa("");
  criarTarefa(null);

  expect(getListaTarefas()).toHaveLength(2);
  expect(getListaTarefas()[0].descricao).toBe("");
  expect(getListaTarefas()[1].descricao).toBeNull();
});

// --- listarTarefas ---------------------------------------------------------

test("listarTarefas exibe a lista atual de tarefas no console", () => {
  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  criarTarefa("Tarefa única");

  listarTarefas();

  expect(consoleSpy).toHaveBeenCalledWith([
    { id: 1, descricao: "Tarefa única", concluida: false }
  ]);
  consoleSpy.mockRestore();
});

test("listarTarefas exibe lista vazia quando não há tarefas", () => {
  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

  listarTarefas();

  expect(consoleSpy).toHaveBeenCalledWith([]);
  consoleSpy.mockRestore();
});

// --- concluirTarefa ---------------------------------------------------------

test("concluirTarefa marca uma tarefa existente como concluída", () => {
  criarTarefa("Concluir tarefa");

  concluirTarefa(1);

  expect(getListaTarefas()[0].concluida).toBe(true);
});

test("concluirTarefa registra mensagem de erro quando a tarefa não existe", () => {
  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

  concluirTarefa(99);

  expect(consoleSpy).toHaveBeenCalledWith("Tarefa não encontrada.");
  consoleSpy.mockRestore();
});

// --- excluirTarefa ---------------------------------------------------------

test("excluirTarefa remove a tarefa correspondente da lista", () => {
  criarTarefa("Primeira tarefa");
  criarTarefa("Segunda tarefa");

  excluirTarefa(1);

  expect(getListaTarefas().map(tarefa => tarefa.id)).toEqual([2]);
});

test("excluirTarefa não altera a lista quando o id não existe", () => {
  criarTarefa("Única tarefa");

  excluirTarefa(99);

  expect(getListaTarefas()).toHaveLength(1);
});

// --- atualizarDescricao ---------------------------------------------------------

test("atualizarDescricao altera a descrição de uma tarefa existente", () => {
  criarTarefa("Descrição antiga");

  atualizarDescricao(1, "Descrição nova");

  expect(getListaTarefas()[0].descricao).toBe("Descrição nova");
});

test("atualizarDescricao registra mensagem de erro quando a tarefa não existe", () => {
  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

  atualizarDescricao(99, "Descrição nova");

  expect(consoleSpy).toHaveBeenCalledWith("Tarefa não encontrada.");
  consoleSpy.mockRestore();
});

// --- reabrirTarefa ---------------------------------------------------------

test("reabrirTarefa marca uma tarefa concluída como não concluída", () => {
  criarTarefa("Reabrir tarefa");
  concluirTarefa(1);

  reabrirTarefa(1);

  expect(getListaTarefas()[0].concluida).toBe(false);
});

test("reabrirTarefa registra mensagem de erro quando a tarefa não existe", () => {
  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

  reabrirTarefa(99);

  expect(consoleSpy).toHaveBeenCalledWith("Tarefa não encontrada.");
  consoleSpy.mockRestore();
});

// --- buscarTarefa ---------------------------------------------------------

test("buscarTarefa exibe no console a tarefa encontrada", () => {
  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  criarTarefa("Tarefa buscada");

  buscarTarefa(1);

  expect(consoleSpy).toHaveBeenCalledWith({
    id: 1,
    descricao: "Tarefa buscada",
    concluida: false
  });
  consoleSpy.mockRestore();
});

test("buscarTarefa registra mensagem de erro quando a tarefa não existe", () => {
  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

  buscarTarefa(99);

  expect(consoleSpy).toHaveBeenCalledWith("Tarefa não encontrada.");
  consoleSpy.mockRestore();
});

// --- fluxo combinado / edge case conhecido ---------------------------------------------------------

test("id pode se repetir após exclusões, pois é calculado por listaTarefas.length + 1 (limitação conhecida do código atual)", () => {
  criarTarefa("Tarefa 1"); // id 1
  criarTarefa("Tarefa 2"); // id 2
  excluirTarefa(1); // sobra só a tarefa de id 2, length passa a ser 1

  criarTarefa("Tarefa 3"); // novo id = length(1) + 1 = 2, duplicado

  const ids = getListaTarefas().map(tarefa => tarefa.id);
  expect(ids).toEqual([2, 2]);
});
