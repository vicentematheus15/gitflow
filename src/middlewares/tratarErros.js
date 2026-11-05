const { ErroValidacao, ErroNaoEncontrado } = require("../errors/erros");

// Converte os erros da aplicação em respostas HTTP. As rotas só repassam o erro
// com next(erro); o mapeamento erro -> status fica concentrado aqui.
// O 4º parâmetro (next) é obrigatório para o Express reconhecer um middleware de erro.
// eslint-disable-next-line no-unused-vars
function tratarErros(erro, req, res, next) {
  if (erro instanceof ErroValidacao) {
    return res.status(400).json({ error: erro.message });
  }

  if (erro instanceof ErroNaoEncontrado) {
    return res.status(404).json({ error: erro.message });
  }

  if (erro.type === "entity.parse.failed") {
    return res.status(400).json({ error: "JSON inválido." });
  }

  console.error(erro);
  return res.status(500).json({ error: "Erro interno do servidor." });
}

module.exports = tratarErros;
