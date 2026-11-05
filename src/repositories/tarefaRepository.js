const db = require("../config/database");

const COLUNAS = "id, descricao, concluida";

function mapearTarefa(linha) {
  return {
    id: linha.id,
    descricao: linha.descricao,
    concluida: Boolean(linha.concluida)
  };
}

async function listar() {
  const [linhas] = await db.execute(
    `SELECT ${COLUNAS} FROM tarefas ORDER BY id`
  );

  return linhas.map(mapearTarefa);
}

async function buscarPorId(id) {
  const [linhas] = await db.execute(
    `SELECT ${COLUNAS} FROM tarefas WHERE id = ?`,
    [id]
  );

  return linhas.length ? mapearTarefa(linhas[0]) : null;
}

async function criar(descricao) {
  const [resultado] = await db.execute(
    "INSERT INTO tarefas (descricao) VALUES (?)",
    [descricao]
  );

  return buscarPorId(resultado.insertId);
}

async function atualizarDescricao(id, descricao) {
  await db.execute("UPDATE tarefas SET descricao = ? WHERE id = ?", [
    descricao,
    id
  ]);

  return buscarPorId(id);
}

async function definirConcluida(id, concluida) {
  await db.execute("UPDATE tarefas SET concluida = ? WHERE id = ?", [
    concluida,
    id
  ]);

  return buscarPorId(id);
}

async function excluir(id) {
  await db.execute("DELETE FROM tarefas WHERE id = ?", [id]);
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizarDescricao,
  definirConcluida,
  excluir
};
