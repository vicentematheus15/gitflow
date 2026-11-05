const repository = require("../repositories/tarefaRepository");
const { ErroValidacao, ErroNaoEncontrado } = require("../errors/erros");

function validarId(id) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new ErroValidacao("O id da tarefa deve ser um número inteiro positivo.");
  }
}

function validarDescricao(descricao) {
  if (typeof descricao !== "string" || descricao.trim() === "") {
    throw new ErroValidacao("A descrição da tarefa é obrigatória.");
  }
}

async function listarTarefas() {
  return repository.listar();
}

async function buscarTarefa(id) {
  validarId(id);

  const tarefa = await repository.buscarPorId(id);

  if (!tarefa) {
    throw new ErroNaoEncontrado();
  }

  return tarefa;
}

async function criarTarefa(descricao) {
  validarDescricao(descricao);

  return repository.criar(descricao.trim());
}

async function atualizarDescricao(id, descricao) {
  validarDescricao(descricao);
  await buscarTarefa(id);

  return repository.atualizarDescricao(id, descricao.trim());
}

async function concluirTarefa(id) {
  await buscarTarefa(id);

  return repository.definirConcluida(id, true);
}

async function reabrirTarefa(id) {
  await buscarTarefa(id);

  return repository.definirConcluida(id, false);
}

async function excluirTarefa(id) {
  const tarefa = await buscarTarefa(id);
  await repository.excluir(id);

  return tarefa;
}

module.exports = {
  listarTarefas,
  buscarTarefa,
  criarTarefa,
  atualizarDescricao,
  concluirTarefa,
  reabrirTarefa,
  excluirTarefa
};
