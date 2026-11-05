jest.mock("../src/repositories/tarefaRepository");

const repository = require("../src/repositories/tarefaRepository");
const service = require("../src/services/tarefaService");
const { ErroValidacao, ErroNaoEncontrado } = require("../src/errors/erros");

const TAREFA = { id: 1, descricao: "Tarefa", concluida: false };

describe("tarefaService", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("listarTarefas retorna o que o repository devolve", async () => {
    repository.listar.mockResolvedValue([TAREFA]);

    await expect(service.listarTarefas()).resolves.toEqual([TAREFA]);
  });

  test("buscarTarefa retorna a tarefa existente", async () => {
    repository.buscarPorId.mockResolvedValue(TAREFA);

    await expect(service.buscarTarefa(1)).resolves.toEqual(TAREFA);
  });

  test("buscarTarefa lança ErroNaoEncontrado quando a tarefa não existe", async () => {
    repository.buscarPorId.mockResolvedValue(null);

    await expect(service.buscarTarefa(99)).rejects.toThrow(ErroNaoEncontrado);
    await expect(service.buscarTarefa(99)).rejects.toThrow("Tarefa não encontrada.");
  });

  test.each([NaN, 0, -1, 1.5])("buscarTarefa rejeita id inválido (%p)", async id => {
    await expect(service.buscarTarefa(id)).rejects.toThrow(ErroValidacao);
    expect(repository.buscarPorId).not.toHaveBeenCalled();
  });

  test("criarTarefa remove espaços e delega ao repository", async () => {
    repository.criar.mockResolvedValue(TAREFA);

    await expect(service.criarTarefa("  Tarefa  ")).resolves.toEqual(TAREFA);
    expect(repository.criar).toHaveBeenCalledWith("Tarefa");
  });

  test.each(["", "   ", null, undefined, 123])(
    "criarTarefa rejeita descrição inválida (%p)",
    async descricao => {
      await expect(service.criarTarefa(descricao)).rejects.toThrow(
        "A descrição da tarefa é obrigatória."
      );
      expect(repository.criar).not.toHaveBeenCalled();
    }
  );

  test("atualizarDescricao valida, confirma que existe e atualiza", async () => {
    repository.buscarPorId.mockResolvedValue(TAREFA);
    repository.atualizarDescricao.mockResolvedValue({ ...TAREFA, descricao: "Nova" });

    await expect(service.atualizarDescricao(1, "  Nova  ")).resolves.toEqual({
      ...TAREFA,
      descricao: "Nova"
    });
    expect(repository.atualizarDescricao).toHaveBeenCalledWith(1, "Nova");
  });

  test("atualizarDescricao rejeita descrição vazia e tarefa inexistente", async () => {
    await expect(service.atualizarDescricao(1, "")).rejects.toThrow(ErroValidacao);

    repository.buscarPorId.mockResolvedValue(null);
    await expect(service.atualizarDescricao(99, "Nova")).rejects.toThrow(ErroNaoEncontrado);
    expect(repository.atualizarDescricao).not.toHaveBeenCalled();
  });

  test("concluirTarefa e reabrirTarefa alteram o status", async () => {
    repository.buscarPorId.mockResolvedValue(TAREFA);
    repository.definirConcluida.mockImplementation(async (id, concluida) => ({
      ...TAREFA,
      concluida
    }));

    await expect(service.concluirTarefa(1)).resolves.toMatchObject({ concluida: true });
    await expect(service.reabrirTarefa(1)).resolves.toMatchObject({ concluida: false });
  });

  test("concluirTarefa e reabrirTarefa lançam erro quando a tarefa não existe", async () => {
    repository.buscarPorId.mockResolvedValue(null);

    await expect(service.concluirTarefa(99)).rejects.toThrow(ErroNaoEncontrado);
    await expect(service.reabrirTarefa(99)).rejects.toThrow(ErroNaoEncontrado);
    expect(repository.definirConcluida).not.toHaveBeenCalled();
  });

  test("excluirTarefa remove e retorna a tarefa excluída", async () => {
    repository.buscarPorId.mockResolvedValue(TAREFA);
    repository.excluir.mockResolvedValue();

    await expect(service.excluirTarefa(1)).resolves.toEqual(TAREFA);
    expect(repository.excluir).toHaveBeenCalledWith(1);
  });

  test("excluirTarefa lança erro quando a tarefa não existe", async () => {
    repository.buscarPorId.mockResolvedValue(null);

    await expect(service.excluirTarefa(99)).rejects.toThrow(ErroNaoEncontrado);
    expect(repository.excluir).not.toHaveBeenCalled();
  });
});
